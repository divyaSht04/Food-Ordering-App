package food.ordering.backend.services.interfaces;

import food.ordering.backend.dto.authDTOs.AuthRequest;
import food.ordering.backend.dto.authDTOs.AuthResponse;
import food.ordering.backend.dto.authDTOs.LogoutResponse;
import food.ordering.backend.dto.authDTOs.RegisterRequest;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {

    AuthResponse login(AuthRequest authRequest);
    AuthResponse register(RegisterRequest registerRequest);
    LogoutResponse logout(String token);
    AuthResponse refreshToken(String refreshToken);
}
