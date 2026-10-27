package com.example.eventbooking.controller;

import com.example.eventbooking.dto.request.UpdateUserRoleRequest;
import com.example.eventbooking.dto.response.UserResponse;
import com.example.eventbooking.exception.GlobalExceptionHandler;
import com.example.eventbooking.exception.ResourceNotFoundException;
import com.example.eventbooking.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private UserService userService;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {

        objectMapper = new ObjectMapper();

        AdminController adminController =
                new AdminController(userService);

        mockMvc = MockMvcBuilders
                .standaloneSetup(adminController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void getAllUsers_shouldReturnUsers() throws Exception {

        UserResponse user1 =
                new UserResponse(
                        1L,
                        "Test User",
                        "test@example.com",
                        "USER"
                );

        UserResponse user2 =
                new UserResponse(
                        2L,
                        "Admin User",
                        "admin@example.com",
                        "ADMIN"
                );

        Page<UserResponse> responsePage =
                new PageImpl<>(
                        List.of(user1, user2),
                        PageRequest.of(0, 10),
                        2
                );

        when(
                userService.getAllUsers(
                        eq(0),
                        eq(10),
                        eq("id"),
                        eq("asc"),
                        nullable(String.class)
                )
        ).thenReturn(responsePage);

        mockMvc.perform(
                        get("/api/admin/users")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].name")
                        .value("Test User"))
                .andExpect(jsonPath("$.content[0].email")
                        .value("test@example.com"))
                .andExpect(jsonPath("$.content[0].role")
                        .value("USER"))
                .andExpect(jsonPath("$.content[1].id").value(2))
                .andExpect(jsonPath("$.content[1].role")
                        .value("ADMIN"));

        verify(userService).getAllUsers(
                eq(0),
                eq(10),
                eq("id"),
                eq("asc"),
                nullable(String.class)
        );
    }

    @Test
    void getAllUsers_shouldAcceptSearchAndSortingParameters()
            throws Exception {

        UserResponse user =
                new UserResponse(
                        1L,
                        "Test User",
                        "test@example.com",
                        "USER"
                );

        Page<UserResponse> responsePage =
                new PageImpl<>(
                        List.of(user),
                        PageRequest.of(1, 5),
                        1
                );

        when(
                userService.getAllUsers(
                        eq(1),
                        eq(5),
                        eq("name"),
                        eq("desc"),
                        eq("Test")
                )
        ).thenReturn(responsePage);

        mockMvc.perform(
                        get("/api/admin/users")
                                .param("page", "1")
                                .param("size", "5")
                                .param("sortBy", "name")
                                .param("direction", "desc")
                                .param("search", "Test")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].name")
                        .value("Test User"));

        verify(userService).getAllUsers(
                eq(1),
                eq(5),
                eq("name"),
                eq("desc"),
                eq("Test")
        );
    }

    @Test
    void updateUserRole_shouldReturnUpdatedUser() throws Exception {

        UpdateUserRoleRequest request =
                new UpdateUserRoleRequest();

        request.setRole("ADMIN");

        UserResponse response =
                new UserResponse(
                        1L,
                        "Test User",
                        "test@example.com",
                        "ADMIN"
                );

        when(
                userService.updateUserRole(
                        eq(1L),
                        any(UpdateUserRoleRequest.class)
                )
        ).thenReturn(response);

        mockMvc.perform(
                        put("/api/admin/users/1/role")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name")
                        .value("Test User"))
                .andExpect(jsonPath("$.email")
                        .value("test@example.com"))
                .andExpect(jsonPath("$.role")
                        .value("ADMIN"));

        verify(userService).updateUserRole(
                eq(1L),
                any(UpdateUserRoleRequest.class)
        );
    }

    @Test
    void updateUserRole_shouldReturnNotFound_whenUserDoesNotExist()
            throws Exception {

        UpdateUserRoleRequest request =
                new UpdateUserRoleRequest();

        request.setRole("ADMIN");

        when(
                userService.updateUserRole(
                        eq(999L),
                        any(UpdateUserRoleRequest.class)
                )
        ).thenThrow(
                new ResourceNotFoundException(
                        "User not found with id: 999"
                )
        );

        mockMvc.perform(
                        put("/api/admin/users/999/role")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error")
                        .value("Not Found"))
                .andExpect(jsonPath("$.message")
                        .value("User not found with id: 999"));

        verify(userService).updateUserRole(
                eq(999L),
                any(UpdateUserRoleRequest.class)
        );
    }

    @Test
    void deleteUser_shouldReturnNoContent() throws Exception {

        doNothing()
                .when(userService)
                .deleteUser(1L);

        mockMvc.perform(
                        delete("/api/admin/users/1")
                )
                .andExpect(status().isNoContent());

        verify(userService).deleteUser(1L);
    }

    @Test
    void deleteUser_shouldReturnBadRequest_whenUserHasBookings()
            throws Exception {

        doThrow(
                new IllegalArgumentException(
                        "Cannot delete user because the user has existing bookings"
                )
        )
                .when(userService)
                .deleteUser(1L);

        mockMvc.perform(
                        delete("/api/admin/users/1")
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("Bad Request"))
                .andExpect(jsonPath("$.message")
                        .value(
                                "Cannot delete user because the user has existing bookings"
                        ));

        verify(userService).deleteUser(1L);
    }
}