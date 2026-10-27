package com.example.eventbooking.controller;

import com.example.eventbooking.dto.request.UpdateUserRoleRequest;
import com.example.eventbooking.dto.response.UserResponse;
import com.example.eventbooking.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search) {

        return ResponseEntity.ok(
                userService.getAllUsers(
                        page,
                        size,
                        sortBy,
                        direction,
                        search
                )
        );
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequest request) {

        return ResponseEntity.ok(
                userService.updateUserRole(id, request)
        );
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }
}