package food.ordering.backend.exception;

import org.springframework.http.HttpStatus;

public class JwtTokenException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String errorCode;

    public JwtTokenException(String message) {
        super(message);
        this.httpStatus = HttpStatus.UNAUTHORIZED;
        this.errorCode = "JWT_TOKEN_ERROR";
    }

    public JwtTokenException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = "JWT_TOKEN_ERROR";
    }

    public JwtTokenException(String message, HttpStatus httpStatus, String errorCode) {
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

    // Static factory methods for common JWT exceptions
    public static JwtTokenException tokenExpired() {
        return new JwtTokenException(
            "JWT token has expired", 
            HttpStatus.UNAUTHORIZED, 
            "TOKEN_EXPIRED"
        );
    }

    public static JwtTokenException tokenInvalid() {
        return new JwtTokenException(
            "JWT token is invalid", 
            HttpStatus.UNAUTHORIZED, 
            "TOKEN_INVALID"
        );
    }

    public static JwtTokenException tokenMalformed() {
        return new JwtTokenException(
            "JWT token is malformed", 
            HttpStatus.BAD_REQUEST, 
            "TOKEN_MALFORMED"
        );
    }

    public static JwtTokenException tokenMissing() {
        return new JwtTokenException(
            "JWT token is missing", 
            HttpStatus.UNAUTHORIZED, 
            "TOKEN_MISSING"
        );
    }

    public static JwtTokenException refreshTokenExpired() {
        return new JwtTokenException(
            "Refresh token has expired", 
            HttpStatus.UNAUTHORIZED, 
            "REFRESH_TOKEN_EXPIRED"
        );
    }

    public static JwtTokenException refreshTokenInvalid() {
        return new JwtTokenException(
            "Refresh token is invalid", 
            HttpStatus.UNAUTHORIZED, 
            "REFRESH_TOKEN_INVALID"
        );
    }

    public static JwtTokenException refreshTokenRevoked() {
        return new JwtTokenException(
            "Refresh token has been revoked", 
            HttpStatus.UNAUTHORIZED, 
            "REFRESH_TOKEN_REVOKED"
        );
    }

    public static JwtTokenException tokenBlacklisted() {
        return new JwtTokenException(
            "JWT token has been blacklisted", 
            HttpStatus.UNAUTHORIZED, 
            "TOKEN_BLACKLISTED"
        );
    }

    public static JwtTokenException signatureInvalid() {
        return new JwtTokenException(
            "JWT token signature is invalid", 
            HttpStatus.UNAUTHORIZED, 
            "TOKEN_SIGNATURE_INVALID"
        );
    }
}
