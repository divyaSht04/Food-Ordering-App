package food.ordering.backend.services;

import food.ordering.backend.entity.RefreshToken;
import food.ordering.backend.entity.User;
import food.ordering.backend.exception.JwtTokenException;
import food.ordering.backend.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refreshTokenExpirationMs:604800000}") // 7 days default
    private long refreshTokenDurationMs;

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .revoked(false)
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        log.info("Created new refresh token for user: {}", user.getEmail());
        return savedToken;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            log.warn("Refresh token expired and deleted: {}", token.getToken());
            throw new JwtTokenException("Refresh token has expired. Please sign in again.");
        }
        return token;
    }

    public boolean isTokenRevoked(RefreshToken token) {
        return token.isRevoked();
    }

    @Transactional
    public void revokeToken(String token) {
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByToken(token);
        if (refreshToken.isPresent()) {
            RefreshToken tokenEntity = refreshToken.get();
            tokenEntity.setRevoked(true);
            refreshTokenRepository.save(tokenEntity);
            log.info("Revoked refresh token: {}", token);
        }
    }

    @Transactional
    public void revokeAllUserTokens(User user) {
        refreshTokenRepository.revokeAllUserTokens(user);
        log.info("Revoked all refresh tokens for user: {}", user.getEmail());
    }

    @Transactional
    public void deleteExpiredTokens() {
        refreshTokenRepository.deleteAllExpiredTokens(Instant.now());
        log.info("Deleted all expired refresh tokens");
    }

    @Transactional
    public RefreshToken rotateRefreshToken(RefreshToken oldToken) {
        RefreshToken newToken = RefreshToken.builder()
                .user(oldToken.getUser())
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .revoked(false)
                .build();

        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        RefreshToken savedToken = refreshTokenRepository.save(newToken);
        log.info("Rotated refresh token for user: {}", oldToken.getUser().getEmail());
        return savedToken;
    }
}
