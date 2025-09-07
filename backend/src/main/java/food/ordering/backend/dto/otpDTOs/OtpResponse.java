package food.ordering.backend.dto.otpDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpResponse {
    
    private boolean success;
    private String message;
    private Integer remainingAttempts;
    private String email;
}
