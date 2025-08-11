package food.ordering.backend.dto.authDTOs;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String email;
    private String firstName;
    private String lastName;
}
