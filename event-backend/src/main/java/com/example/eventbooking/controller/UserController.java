package com.example.eventbooking.controller;

import com.example.eventbooking.dto.request.CreateUserRequest;
import com.example.eventbooking.dto.request.LoginRequest;
import com.example.eventbooking.dto.response.LoginResponse;
import com.example.eventbooking.dto.response.UserResponse;
import com.example.eventbooking.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.createUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                userService.login(request)
        );
    }
}