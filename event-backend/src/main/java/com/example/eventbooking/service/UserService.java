package com.example.eventbooking.service;

import com.example.eventbooking.dto.request.CreateUserRequest;
import com.example.eventbooking.dto.request.LoginRequest;
import com.example.eventbooking.dto.request.UpdateUserRoleRequest;
import com.example.eventbooking.dto.response.LoginResponse;
import com.example.eventbooking.dto.response.UserResponse;
import org.springframework.data.domain.Page;

public interface UserService {

    UserResponse createUser(CreateUserRequest request);

    LoginResponse login(LoginRequest request);

    Page<UserResponse> getAllUsers(
            int page,
            int size,
            String sortBy,
            String direction,
            String search);

    UserResponse updateUserRole(
            Long id,
            UpdateUserRoleRequest request);

    void deleteUser(Long id);
}