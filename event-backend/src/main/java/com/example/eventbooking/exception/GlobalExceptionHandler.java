package com.example.eventbooking.exception;

import com.example.eventbooking.dto.response.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {

        log.warn("Validation error occurred");

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Validation Error",
                "Invalid request data",
                errors
        );
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateException(
            DuplicateResourceException ex) {

        log.warn("Duplicate resource: {}", ex.getMessage());

        return buildResponse(
                HttpStatus.CONFLICT,
                "Conflict",
                ex.getMessage(),
                null
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(
            ResourceNotFoundException ex) {

        log.warn("Resource not found: {}", ex.getMessage());

        return buildResponse(
                HttpStatus.NOT_FOUND,
                "Not Found",
                ex.getMessage(),
                null
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex) {

        log.warn("Invalid request: {}", ex.getMessage());

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Bad Request",
                ex.getMessage(),
                null
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException ex) {

        log.warn("Authentication failed: {}", ex.getMessage());

        return buildResponse(
                HttpStatus.UNAUTHORIZED,
                "Unauthorized",
                "Authentication failed",
                null
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(
            Exception ex) {

        log.error("Unexpected error occurred", ex);

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal Server Error",
                "An unexpected error occurred",
                null
        );
    }

    private ResponseEntity<ErrorResponse> buildResponse(
            HttpStatus status,
            String error,
            String message,
            Map<String, String> validationErrors) {

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                error,
                message,
                validationErrors
        );

        return ResponseEntity
                .status(status)
                .body(response);
    }
}