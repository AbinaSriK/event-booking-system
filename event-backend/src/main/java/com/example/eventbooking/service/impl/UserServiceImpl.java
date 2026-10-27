package com.example.eventbooking.service.impl;

import com.example.eventbooking.dto.request.CreateUserRequest;
import com.example.eventbooking.dto.request.LoginRequest;
import com.example.eventbooking.dto.request.UpdateUserRoleRequest;
import com.example.eventbooking.dto.response.LoginResponse;
import com.example.eventbooking.dto.response.UserResponse;
import com.example.eventbooking.exception.DuplicateResourceException;
import com.example.eventbooking.exception.ResourceNotFoundException;
import com.example.eventbooking.model.User;
import com.example.eventbooking.repository.BookingRepository;
import com.example.eventbooking.repository.UserRepository;
import com.example.eventbooking.security.JwtService;
import com.example.eventbooking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Logger log =
            LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public UserResponse createUser(CreateUserRequest request) {

        log.info("Creating user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {

            log.warn(
                    "Registration failed. Email already exists: {}",
                    request.getEmail()
            );

            throw new DuplicateResourceException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        log.info(
                "User created successfully with id: {}",
                savedUser.getId()
        );

        return mapToResponse(savedUser);
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        log.info(
                "Login attempt for email: {}",
                request.getEmail()
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {

                    log.warn(
                            "Login failed - email not found: {}",
                            request.getEmail()
                    );

                    return new IllegalArgumentException(
                            "Invalid email or password"
                    );
                });

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            log.warn(
                    "Login failed - invalid password for email: {}",
                    request.getEmail()
            );

            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole()
        );

        log.info(
                "User logged in successfully: {}",
                user.getEmail()
        );

        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                token
        );
    }

    @Override
    public Page<UserResponse> getAllUsers(
            int page,
            int size,
            String sortBy,
            String direction,
            String search
    ) {

        log.info(
                "Fetching users - page: {}, size: {}, sortBy: {}, direction: {}, search: {}",
                page,
                size,
                sortBy,
                direction,
                search
        );

        if (!sortBy.equals("id")
                && !sortBy.equals("name")
                && !sortBy.equals("email")
                && !sortBy.equals("role")) {

            log.warn(
                    "Invalid user sort field: {}",
                    sortBy
            );

            throw new IllegalArgumentException(
                    "Invalid sort field. Allowed: id, name, email, role"
            );
        }

        Sort.Direction sortDirection =
                direction.equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, sortBy)
        );

        Page<User> users;

        if (search != null && !search.isBlank()) {

            users = userRepository
                    .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            search,
                            search,
                            pageable
                    );

        } else {

            users = userRepository.findAll(pageable);
        }

        log.info(
                "Fetched {} users",
                users.getTotalElements()
        );

        return users.map(this::mapToResponse);
    }

    @Override
    public UserResponse updateUserRole(
            Long id,
            UpdateUserRoleRequest request
    ) {

        log.info(
                "Updating role for user id: {}",
                id
        );

        User user = userRepository.findById(id)
                .orElseThrow(() -> {

                    log.warn(
                            "User not found while updating role: {}",
                            id
                    );

                    return new ResourceNotFoundException(
                            "User not found with id: " + id
                    );
                });

        String role = request.getRole().toUpperCase();

        if (!role.equals("USER")
                && !role.equals("ADMIN")) {

            log.warn(
                    "Invalid role '{}' for user id: {}",
                    role,
                    id
            );

            throw new IllegalArgumentException(
                    "Invalid role. Allowed roles: USER, ADMIN"
            );
        }

        user.setRole(role);

        User updatedUser = userRepository.save(user);

        log.info(
                "User role updated successfully - userId: {}, role: {}",
                id,
                role
        );

        return mapToResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {

        log.info(
                "Deleting user with id: {}",
                id
        );

        User user = userRepository.findById(id)
                .orElseThrow(() -> {

                    log.warn(
                            "User not found for deletion: {}",
                            id
                    );

                    return new ResourceNotFoundException(
                            "User not found with id: " + id
                    );
                });

        if (bookingRepository.existsByUserId(id)) {

            log.warn(
                    "Cannot delete user {} because existing bookings were found",
                    id
            );

            throw new IllegalArgumentException(
                    "Cannot delete user because the user has existing bookings"
            );
        }

        userRepository.delete(user);

        log.info(
                "User deleted successfully with id: {}",
                id
        );
    }

    private UserResponse mapToResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}