package food.ordering.backend.dto.errorDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private String message;
    private String errorCode;
    private int status;
    private String path;
    private LocalDateTime timestamp;
    
    public static ErrorResponse of(String message, String errorCode, int status, String path) {
        return ErrorResponse.builder()
                .message(message)
                .errorCode(errorCode)
                .status(status)
                .path(path)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
