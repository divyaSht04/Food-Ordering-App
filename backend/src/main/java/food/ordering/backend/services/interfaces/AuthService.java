package food.ordering.backend.services.interfaces;

import food.ordering.backend.dto.authDTOs.*;
import food.ordering.backend.dto.otpDTOs.OtpResponse;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {

    AuthResponse login(AuthRequest authRequest);
    OtpResponse initiateRegistration(RegisterRequest registerRequest);
    AuthResponse completeRegistration(RegisterVerificationRequest registerVerificationRequest);
    LogoutResponse logout(String token);
    AuthResponse refreshToken(String refreshToken);
    AdminRegistrationResponse adminRegistration(@Valid RegisterRequest registerRequest);
}
