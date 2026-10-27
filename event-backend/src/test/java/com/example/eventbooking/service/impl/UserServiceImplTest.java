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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void createUser_shouldCreateUserSuccessfully() {

        CreateUserRequest request = new CreateUserRequest();
        request.setName("Abina");
        request.setEmail("abina@gmail.com");
        request.setPassword("password123");

        User savedUser = createUser(
                1L,
                "Abina",
                "abina@gmail.com",
                "encodedPassword",
                "USER"
        );

        when(userRepository.existsByEmail("abina@gmail.com"))
                .thenReturn(false);

        when(passwordEncoder.encode("password123"))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenReturn(savedUser);

        UserResponse response =
                userService.createUser(request);

        assertNotNull(response);

        assertEquals(1L, response.getId());
        assertEquals("Abina", response.getName());
        assertEquals("abina@gmail.com", response.getEmail());
        assertEquals("USER", response.getRole());

        verify(userRepository, times(1))
                .existsByEmail("abina@gmail.com");

        verify(passwordEncoder, times(1))
                .encode("password123");

        verify(userRepository, times(1))
                .save(any(User.class));
    }

    @Test
    void createUser_shouldThrowExceptionWhenEmailAlreadyExists() {

        CreateUserRequest request = new CreateUserRequest();
        request.setName("Abina");
        request.setEmail("abina@gmail.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("abina@gmail.com"))
                .thenReturn(true);

        DuplicateResourceException exception =
                assertThrows(
                        DuplicateResourceException.class,
                        () -> userService.createUser(request)
                );

        assertEquals(
                "Email already registered",
                exception.getMessage()
        );

        verify(userRepository, times(1))
                .existsByEmail("abina@gmail.com");

        verify(passwordEncoder, never())
                .encode(anyString());

        verify(userRepository, never())
                .save(any(User.class));
    }

    @Test
    void login_shouldLoginSuccessfully() {

        LoginRequest request = new LoginRequest();
        request.setEmail("abina@gmail.com");
        request.setPassword("password123");

        User user = createUser(
                1L,
                "Abina",
                "abina@gmail.com",
                "encodedPassword",
                "USER"
        );

        when(userRepository.findByEmail("abina@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "password123",
                "encodedPassword"
        )).thenReturn(true);

        when(jwtService.generateToken(
                1L,
                "abina@gmail.com",
                "USER"
        )).thenReturn("test-jwt-token");

        LoginResponse response =
                userService.login(request);

        assertNotNull(response);

        assertEquals(
                1L,
                response.getUserId()
        );

        assertEquals(
                "abina@gmail.com",
                response.getEmail()
        );

        assertEquals(
                "test-jwt-token",
                response.getToken()
        );

        verify(userRepository, times(1))
                .findByEmail("abina@gmail.com");

        verify(passwordEncoder, times(1))
                .matches(
                        "password123",
                        "encodedPassword"
                );

        verify(jwtService, times(1))
                .generateToken(
                        1L,
                        "abina@gmail.com",
                        "USER"
                );
    }


    @Test
    void login_shouldThrowExceptionWhenEmailDoesNotExist() {

        LoginRequest request = new LoginRequest();
        request.setEmail("unknown@gmail.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("unknown@gmail.com"))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> userService.login(request)
                );

        assertEquals(
                "Invalid email or password",
                exception.getMessage()
        );

        verify(userRepository, times(1))
                .findByEmail("unknown@gmail.com");

        verify(passwordEncoder, never())
                .matches(anyString(), anyString());

        verify(jwtService, never())
                .generateToken(
                        anyLong(),
                        anyString(),
                        anyString()
                );
    }


    @Test
    void login_shouldThrowExceptionWhenPasswordIsIncorrect() {

        LoginRequest request = new LoginRequest();
        request.setEmail("abina@gmail.com");
        request.setPassword("wrongPassword");

        User user = createUser(
                1L,
                "Abina",
                "abina@gmail.com",
                "encodedPassword",
                "USER"
        );

        when(userRepository.findByEmail("abina@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "wrongPassword",
                "encodedPassword"
        )).thenReturn(false);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> userService.login(request)
                );

        assertEquals(
                "Invalid email or password",
                exception.getMessage()
        );

        verify(userRepository, times(1))
                .findByEmail("abina@gmail.com");

        verify(passwordEncoder, times(1))
                .matches(
                        "wrongPassword",
                        "encodedPassword"
                );

        verify(jwtService, never())
                .generateToken(
                        anyLong(),
                        anyString(),
                        anyString()
                );
    }

    @Test
    void getAllUsers_shouldReturnAllUsers() {

        User user1 = createUser(
                1L,
                "Abina",
                "abina@gmail.com",
                "encoded1",
                "USER"
        );

        User user2 = createUser(
                2L,
                "Admin",
                "admin@gmail.com",
                "encoded2",
                "ADMIN"
        );

        Page<User> userPage =
                new PageImpl<>(
                        List.of(user1, user2)
                );

        when(userRepository.findAll(any(Pageable.class)))
                .thenReturn(userPage);

        Page<UserResponse> response =
                userService.getAllUsers(
                        0,
                        10,
                        "id",
                        "asc",
                        null
                );

        assertNotNull(response);

        assertEquals(
                2,
                response.getTotalElements()
        );

        assertEquals(
                "Abina",
                response.getContent()
                        .get(0)
                        .getName()
        );

        assertEquals(
                "Admin",
                response.getContent()
                        .get(1)
                        .getName()
        );

        verify(userRepository, times(1))
                .findAll(any(Pageable.class));
    }


    @Test
    void getAllUsers_shouldSearchUsers() {

        User user = createUser(
                1L,
                "Abina",
                "abina@gmail.com",
                "encoded",
                "USER"
        );

        Page<User> userPage =
                new PageImpl<>(List.of(user));

        when(
                userRepository
                        .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                                eq("Abina"),
                                eq("Abina"),
                                any(Pageable.class)
                        )
        ).thenReturn(userPage);

        Page<UserResponse> response =
                userService.getAllUsers(
                        0,
                        10,
                        "name",
                        "asc",
                        "Abina"
                );

        assertNotNull(response);

        assertEquals(
                1,
                response.getTotalElements()
        );

        assertEquals(
                "Abina",
                response.getContent()
                        .get(0)
                        .getName()
        );

        verify(
                userRepository,
                times(1)
        ).findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                eq("Abina"),
                eq("Abina"),
                any(Pageable.class)
        );

        verify(
                userRepository,
                never()
        ).findAll(any(Pageable.class));
    }


    @Test
    void getAllUsers_shouldThrowExceptionForInvalidSortField() {

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> userService.getAllUsers(
                                0,
                                10,
                                "password",
                                "asc",
                                null
                        )
                );

        assertEquals(
                "Invalid sort field. Allowed: id, name, email, role",
                exception.getMessage()
        );

        verify(userRepository, never())
                .findAll(any(Pageable.class));

        verify(userRepository, never())
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        anyString(),
                        anyString(),
                        any(Pageable.class)
                );
    }

    @Test
    void updateUserRole_shouldUpdateRoleSuccessfully() {

        Long userId = 1L;

        User user = createUser(
                userId,
                "Abina",
                "abina@gmail.com",
                "encoded",
                "USER"
        );

        UpdateUserRoleRequest request =
                new UpdateUserRoleRequest();

        request.setRole("admin");

        User updatedUser = createUser(
                userId,
                "Abina",
                "abina@gmail.com",
                "encoded",
                "ADMIN"
        );

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        when(userRepository.save(any(User.class)))
                .thenReturn(updatedUser);

        UserResponse response =
                userService.updateUserRole(
                        userId,
                        request
                );

        assertNotNull(response);

        assertEquals(
                1L,
                response.getId()
        );

        assertEquals(
                "ADMIN",
                response.getRole()
        );

        assertEquals(
                "ADMIN",
                user.getRole()
        );

        verify(userRepository, times(1))
                .findById(userId);

        verify(userRepository, times(1))
                .save(user);
    }


    @Test
    void updateUserRole_shouldThrowExceptionWhenUserDoesNotExist() {

        Long userId = 999L;

        UpdateUserRoleRequest request =
                new UpdateUserRoleRequest();

        request.setRole("ADMIN");

        when(userRepository.findById(userId))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> userService.updateUserRole(
                                userId,
                                request
                        )
                );

        assertEquals(
                "User not found with id: 999",
                exception.getMessage()
        );

        verify(userRepository, times(1))
                .findById(userId);

        verify(userRepository, never())
                .save(any(User.class));
    }


    @Test
    void updateUserRole_shouldThrowExceptionForInvalidRole() {

        Long userId = 1L;

        User user = createUser(
                userId,
                "Abina",
                "abina@gmail.com",
                "encoded",
                "USER"
        );

        UpdateUserRoleRequest request =
                new UpdateUserRoleRequest();

        request.setRole("MANAGER");

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> userService.updateUserRole(
                                userId,
                                request
                        )
                );

        assertEquals(
                "Invalid role. Allowed roles: USER, ADMIN",
                exception.getMessage()
        );

        assertEquals(
                "USER",
                user.getRole()
        );

        verify(userRepository, times(1))
                .findById(userId);

        verify(userRepository, never())
                .save(any(User.class));
    }

    @Test
    void deleteUser_shouldDeleteUserSuccessfully() {

        Long userId = 1L;

        User user = createUser(
                userId,
                "Abina",
                "abina@gmail.com",
                "encoded",
                "USER"
        );

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        when(bookingRepository.existsByUserId(userId))
                .thenReturn(false);

        userService.deleteUser(userId);

        verify(userRepository, times(1))
                .findById(userId);

        verify(bookingRepository, times(1))
                .existsByUserId(userId);

        verify(userRepository, times(1))
                .delete(user);
    }


    @Test
    void deleteUser_shouldThrowExceptionWhenUserDoesNotExist() {

        Long userId = 999L;

        when(userRepository.findById(userId))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> userService.deleteUser(userId)
                );

        assertEquals(
                "User not found with id: 999",
                exception.getMessage()
        );

        verify(userRepository, times(1))
                .findById(userId);

        verify(bookingRepository, never())
                .existsByUserId(anyLong());

        verify(userRepository, never())
                .delete(any(User.class));
    }


    @Test
    void deleteUser_shouldThrowExceptionWhenUserHasBookings() {

        Long userId = 1L;

        User user = createUser(
                userId,
                "Abina",
                "abina@gmail.com",
                "encoded",
                "USER"
        );

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        when(bookingRepository.existsByUserId(userId))
                .thenReturn(true);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> userService.deleteUser(userId)
                );

        assertEquals(
                "Cannot delete user because the user has existing bookings",
                exception.getMessage()
        );

        verify(userRepository, times(1))
                .findById(userId);

        verify(bookingRepository, times(1))
                .existsByUserId(userId);

        verify(userRepository, never())
                .delete(any(User.class));
    }

    private User createUser(
            Long id,
            String name,
            String email,
            String password,
            String role) {

        User user = new User();

        user.setId(id);
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);

        return user;
    }
}