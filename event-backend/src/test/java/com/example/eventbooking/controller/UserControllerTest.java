package com.example.eventbooking.controller;

import com.example.eventbooking.dto.request.CreateUserRequest;
import com.example.eventbooking.dto.request.LoginRequest;
import com.example.eventbooking.dto.response.LoginResponse;
import com.example.eventbooking.dto.response.UserResponse;
import com.example.eventbooking.exception.DuplicateResourceException;
import com.example.eventbooking.exception.GlobalExceptionHandler;
import com.example.eventbooking.exception.ResourceNotFoundException;
import com.example.eventbooking.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import tools.jackson.databind.ObjectMapper;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {

        objectMapper = new ObjectMapper();

        UserController userController =
                new UserController(userService);

        mockMvc = MockMvcBuilders
                .standaloneSetup(userController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void createUser_shouldReturnCreated() throws Exception {

        CreateUserRequest request =
                new CreateUserRequest();

        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        UserResponse response =
                new UserResponse(
                        1L,
                        "Test User",
                        "test@example.com",
                        "USER"
                );

        when(
                userService.createUser(
                        any(CreateUserRequest.class)
                )
        ).thenReturn(response);

        mockMvc.perform(
                        post("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name")
                        .value("Test User"))
                .andExpect(jsonPath("$.email")
                        .value("test@example.com"))
                .andExpect(jsonPath("$.role")
                        .value("USER"));

        verify(userService).createUser(
                any(CreateUserRequest.class)
        );
    }

    @Test
    void createUser_shouldReturnConflict_whenEmailAlreadyExists()
            throws Exception {

        CreateUserRequest request =
                new CreateUserRequest();

        request.setName("Test User");
        request.setEmail("existing@example.com");
        request.setPassword("password123");

        when(
                userService.createUser(
                        any(CreateUserRequest.class)
                )
        ).thenThrow(
                new DuplicateResourceException(
                        "Email already registered"
                )
        );

        mockMvc.perform(
                        post("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error")
                        .value("Conflict"))
                .andExpect(jsonPath("$.message")
                        .value("Email already registered"));

        verify(userService).createUser(
                any(CreateUserRequest.class)
        );
    }

    @Test
    void login_shouldReturnOk() throws Exception {

        LoginRequest request =
                new LoginRequest();

        request.setEmail("test@example.com");
        request.setPassword("password123");

        LoginResponse response =
                new LoginResponse(
                        1L,
                        "test@example.com",
                        "test-jwt-token"
                );

        when(
                userService.login(
                        any(LoginRequest.class)
                )
        ).thenReturn(response);

        mockMvc.perform(
                        post("/api/users/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId")
                        .value(1))
                .andExpect(jsonPath("$.email")
                        .value("test@example.com"))
                .andExpect(jsonPath("$.token")
                        .value("test-jwt-token"));

        verify(userService).login(
                any(LoginRequest.class)
        );
    }

    @Test
    void login_shouldReturnBadRequest_whenCredentialsAreInvalid()
            throws Exception {

        LoginRequest request =
                new LoginRequest();

        request.setEmail("test@example.com");
        request.setPassword("wrongpassword");

        when(
                userService.login(
                        any(LoginRequest.class)
                )
        ).thenThrow(
                new IllegalArgumentException(
                        "Invalid email or password"
                )
        );

        mockMvc.perform(
                        post("/api/users/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("Bad Request"))
                .andExpect(jsonPath("$.message")
                        .value("Invalid email or password"));

        verify(userService).login(
                any(LoginRequest.class)
        );
    }
}