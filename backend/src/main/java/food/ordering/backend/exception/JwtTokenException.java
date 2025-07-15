package food.ordering.backend.exception;

public class JwtTokenException extends RuntimeException {
    public JwtTokenException(String message) {
        super(message);
    }
}
