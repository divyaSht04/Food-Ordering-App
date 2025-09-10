package food.ordering.backend.exception;

import org.springframework.http.HttpStatus;

public class UserException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String errorCode;


    public UserException(String message, HttpStatus httpStatus, String errorCode) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public static UserException userNotFound(String email) {
        return new UserException(
            "User with email '" + email + "' not found", 
            HttpStatus.NOT_FOUND, 
            "USER_NOT_FOUND"
        );
    }

    public static UserException userAlreadyExists(String email) {
        return new UserException(
            "User with email '" + email + "' already exists", 
            HttpStatus.CONFLICT, 
            "USER_ALREADY_EXISTS"
        );
    }

    public static UserException invalidCredentials() {
        return new UserException(
            "Invalid email or password", 
            HttpStatus.UNAUTHORIZED, 
            "INVALID_CREDENTIALS"
        );
    }

    public static UserException accountLocked(String email) {
        return new UserException(
            "Account for email '" + email + "' is locked", 
            HttpStatus.LOCKED, 
            "ACCOUNT_LOCKED"
        );
    }

    public static UserException accountNotVerified(String email) {
        return new UserException(
            "Account for email '" + email + "' is not verified", 
            HttpStatus.FORBIDDEN, 
            "ACCOUNT_NOT_VERIFIED"
        );
    }

    public static UserException invalidUserData(String field) {
        return new UserException(
            "Invalid " + field + " provided", 
            HttpStatus.BAD_REQUEST, 
            "INVALID_USER_DATA"
        );
    }
}
