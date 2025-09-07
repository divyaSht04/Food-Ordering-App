package food.ordering.backend.exception;

public class ApiPermissionException extends RuntimeException {
    
    public ApiPermissionException(String message) {
        super(message);
    }
    
    public ApiPermissionException(String message, Throwable cause) {
        super(message, cause);
    }
}
