package food.ordering.backend.services;

import food.ordering.backend.dto.authDTOs.AuthRequest;
import food.ordering.backend.dto.authDTOs.AuthResponse;
import food.ordering.backend.dto.authDTOs.LogoutResponse;
import food.ordering.backend.dto.authDTOs.RegisterRequest;
import food.ordering.backend.dto.authDTOs.RegisterVerificationRequest;
import food.ordering.backend.dto.otpDTOs.OtpResponse;
import food.ordering.backend.entity.PendingUser;
import food.ordering.backend.entity.RefreshToken;
import food.ordering.backend.entity.User;
import food.ordering.backend.enums.RoleType;
import food.ordering.backend.exception.JwtTokenException;
import food.ordering.backend.repository.PendingUserRepository;
import food.ordering.backend.repository.UserRepository;
import food.ordering.backend.service.OtpService;
import food.ordering.backend.service.TokenBlacklistService;
import food.ordering.backend.services.interfaces.AuthService;
import food.ordering.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PendingUserRepository pendingUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;
    private final TokenBlacklistService tokenBlacklistService;
    private final OtpService otpService;

    @Override
    @Transactional
    public OtpResponse initiateRegistration(RegisterRequest registerRequest) {
        log.info("Initiating registration for user with email: {}", registerRequest.getEmail());

        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("User with email " + registerRequest.getEmail() + " already exists");
        }

        // Clean up any existing pending user with same email
        pendingUserRepository.deleteByEmail(registerRequest.getEmail());

        // Create pending user
        PendingUser pendingUser = new PendingUser();
        pendingUser.setEmail(registerRequest.getEmail());
        pendingUser.setFirstName(registerRequest.getFirstName());
        pendingUser.setLastName(registerRequest.getLastName());
        pendingUser.setPhoneNumber(registerRequest.getNumber());
        pendingUser.setEncryptedPassword(passwordEncoder.encode(registerRequest.getPassword()));

        pendingUserRepository.save(pendingUser);
        log.info("Pending user created for email: {}", registerRequest.getEmail());

        String fullName = registerRequest.getFirstName() + " " + registerRequest.getLastName();
        otpService.generateAndSendOtp(registerRequest.getEmail(), fullName);

        return OtpResponse.builder()
                .success(true)
                .message("Registration initiated. Please check your email for OTP verification.")
                .email(registerRequest.getEmail())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse completeRegistration(RegisterVerificationRequest request) {
        log.info("Completing registration for user with email: {}", request.getEmail());

        // Find pending user
        Optional<PendingUser> pendingUserOpt = pendingUserRepository.findByEmail(request.getEmail());
        if (pendingUserOpt.isEmpty()) {
            throw new RuntimeException("No pending registration found for email: " + request.getEmail());
        }

        PendingUser pendingUser = pendingUserOpt.get();

        String fullName = pendingUser.getFirstName() + " " + pendingUser.getLastName();
        boolean isOtpValid = otpService.verifyOtp(request.getEmail(), request.getOtpCode(), fullName);
        
        if (!isOtpValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        // Create actual user
        User newUser = new User();
        newUser.setId(UUID.randomUUID().toString());
        newUser.setPhoneNumber(pendingUser.getPhoneNumber());
        newUser.setFullName(fullName);
        newUser.setEmail(pendingUser.getEmail());
        newUser.setPassword(pendingUser.getEncryptedPassword());
        newUser.setRole(RoleType.CUSTOMER);
        newUser.setPermissions(List.of());

        User savedUser = userRepository.save(newUser);
        log.info("User registration completed successfully with ID: {}", savedUser.getId());

        // Clean up pending user
        pendingUserRepository.deleteByEmail(request.getEmail());

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(savedUser.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .email(savedUser.getEmail())
                .firstName(pendingUser.getFirstName())
                .lastName(pendingUser.getLastName())
                .build();
    }

    @Override
    public AuthResponse login(AuthRequest authRequest) {
        log.info("Attempting login for user: {}", authRequest.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );
            if (authentication.isAuthenticated()) {
                User user = userRepository.findByEmail(authRequest.getEmail())
                        .orElseThrow(() -> new BadCredentialsException("User not found"));

                String accessToken = jwtUtil.generateAccessToken(user.getEmail());
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

                log.info("User logged in successfully: {}", authRequest.getEmail());

                String[] nameParts = user.getFullName().split(" ", 2);
                String firstName = nameParts.length > 0 ? nameParts[0] : "";
                String lastName = nameParts.length > 1 ? nameParts[1] : "";

                return AuthResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken.getToken())
                        .email(user.getEmail())
                        .firstName(firstName)
                        .lastName(lastName)
                        .build();
            }else {
                log.error("Authentication failed for user: {}", authRequest.getEmail());
                throw new BadCredentialsException("Invalid email or password");
            }

        } catch (AuthenticationException e) {
            log.error("Authentication failed for user: {}", authRequest.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @Override
    @Transactional
    public LogoutResponse logout(String token) {
        log.info("Processing logout request");

        try {
            if (token != null && !token.trim().isEmpty()) {
                // Extract email to validate token structure
                String email = jwtUtil.extractEmail(token);

                Optional<User> userOpt = userRepository.findByEmail(email);
                if (userOpt.isPresent()) {
                    refreshTokenService.revokeAllUserTokens(userOpt.get());
                }

                // Add access token to blacklist
                tokenBlacklistService.blacklistToken(token);

                log.info("User logged out successfully: {}", email);

                return LogoutResponse.builder()
                        .message("Logout successful")
                        .success(true)
                        .build();
            } else {
                return LogoutResponse.builder()
                        .message("Invalid token provided")
                        .success(false)
                        .build();
            }
        } catch (JwtTokenException e) {
            log.error("Invalid token provided for logout: {}", e.getMessage());
            return LogoutResponse.builder()
                    .message("Invalid or expired token")
                    .success(false)
                    .build();
        }
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(String refreshTokenStr) {
        log.info("Processing refresh token request");

        if (refreshTokenStr == null || refreshTokenStr.trim().isEmpty()) {
            throw new JwtTokenException("Refresh token is required");
        }

        return refreshTokenService.findByToken(refreshTokenStr)
                .map(refreshTokenService::verifyExpiration)
                .map(refreshToken -> {
                    if (refreshTokenService.isTokenRevoked(refreshToken)) {
                        throw new JwtTokenException("Refresh token has been revoked");
                    }
                    User user = refreshToken.getUser();
                    String newAccessToken = jwtUtil.generateAccessToken(user.getEmail());

                    RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(refreshToken);

                    String[] nameParts = user.getFullName().split(" ", 2);
                    String firstName = nameParts.length > 0 ? nameParts[0] : "";
                    String lastName = nameParts.length > 1 ? nameParts[1] : "";

                    log.info("Token refreshed successfully for user: {}", user.getEmail());

                    return AuthResponse.builder()
                            .accessToken(newAccessToken)
                            .refreshToken(newRefreshToken.getToken())
                            .email(user.getEmail())
                            .firstName(firstName)
                            .lastName(lastName)
                            .build();
                })
                .orElseThrow(() -> new JwtTokenException("Refresh token not found or invalid"));
    }

}
