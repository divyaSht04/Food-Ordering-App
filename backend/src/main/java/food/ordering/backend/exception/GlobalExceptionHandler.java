package food.ordering.backend.exception;

import food.ordering.backend.dto.errorDTOs.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler({JwtTokenException.class})
    public ResponseEntity<ErrorResponse> handleJWTTokenException(JwtTokenException ex, HttpServletRequest request) {
        log.error("JWT Token Exception: {}", ex.getMessage(), ex);
        ErrorResponse errorResponse = ErrorResponse.of(
                ex.getMessage(),
                ex.getErrorCode(),
                ex.getHttpStatus().value(),
                request.getRequestURI()
        );
        return ResponseEntity.status(ex.getHttpStatus()).body(errorResponse);
    }

    @ExceptionHandler({UserException.class})
    public ResponseEntity<ErrorResponse> handleUserException(UserException ex, HttpServletRequest request) {
        log.error("User Exception: {}", ex.getMessage(), ex);
        ErrorResponse errorResponse = ErrorResponse.of(
                ex.getMessage(),
                ex.getErrorCode(),
                ex.getHttpStatus().value(),
                request.getRequestURI()
        );
        return ResponseEntity.status(ex.getHttpStatus()).body(errorResponse);
    }

    @ExceptionHandler({BadCredentialsException.class})
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex, HttpServletRequest request) {
        log.error("Bad Credentials Exception: {}", ex.getMessage(), ex);
        ErrorResponse errorResponse = ErrorResponse.of(
                "Invalid email or password",
                "INVALID_CREDENTIALS",
                HttpStatus.UNAUTHORIZED.value(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        log.error("Validation Exception: {}", ex.getMessage(), ex);
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        String message = "Validation failed: " + errors.toString();
        ErrorResponse errorResponse = ErrorResponse.of(
                message,
                "VALIDATION_ERROR",
                HttpStatus.BAD_REQUEST.value(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler({RuntimeException.class})
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        log.error("Runtime Exception: {}", ex.getMessage(), ex);
        ErrorResponse errorResponse = ErrorResponse.of(
                ex.getMessage(),
                "RUNTIME_ERROR",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    @ExceptionHandler({Exception.class})
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        log.error("Generic Exception: {}", ex.getMessage(), ex);
        ErrorResponse errorResponse = ErrorResponse.of(
                "An unexpected error occurred",
                "INTERNAL_ERROR",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
