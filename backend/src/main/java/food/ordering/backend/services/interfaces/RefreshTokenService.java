package food.ordering.backend.services.interfaces;

import food.ordering.backend.entity.RefreshToken;
import food.ordering.backend.entity.User;

import java.util.Optional;

public interface RefreshTokenService {

     RefreshToken createRefreshToken(User user);
     RefreshToken verifyExpiration(RefreshToken token);
     Optional<RefreshToken> findByToken(String token);
     boolean isTokenRevoked(RefreshToken token);
     void revokeToken(String token);
     void revokeAllUserTokens(User user);
     RefreshToken rotateRefreshToken(RefreshToken oldToken);
     void deleteExpiredTokens();
}
