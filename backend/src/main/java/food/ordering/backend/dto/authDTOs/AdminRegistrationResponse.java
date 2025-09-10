package food.ordering.backend.dto.authDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminRegistrationResponse {
    private boolean success;
    private String message;
    private String adminEmail;
    private String adminFullName;
    private LocalDateTime registeredAt;
    
    public static AdminRegistrationResponse success(String email, String fullName) {
        return AdminRegistrationResponse.builder()
                .success(true)
                .message("Admin registered successfully")
                .adminEmail(email)
                .adminFullName(fullName)
                .registeredAt(LocalDateTime.now())
                .build();
    }
}
