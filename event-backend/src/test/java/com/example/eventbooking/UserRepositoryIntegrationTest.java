package com.example.eventbooking;

import com.example.eventbooking.model.User;
import com.example.eventbooking.repository.UserRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
class UserRepositoryIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16");

    @Autowired
    private UserRepository userRepository;

    @BeforeAll
    static void setTimezone() {
        java.util.TimeZone.setDefault(
                java.util.TimeZone.getTimeZone("UTC")
        );
    }

    @BeforeEach
    void cleanDatabase() {
        userRepository.deleteAll();
    }

    private User createUser(
            String name,
            String email,
            String role
    ) {
        User user = new User();

        user.setName(name);
        user.setEmail(email);
        user.setPassword("password123");
        user.setRole(role);

        return userRepository.save(user);
    }

    @Test
    void shouldSaveAndRetrieveUser() {

        User savedUser = createUser(
                "Abina",
                "abina@test.com",
                "USER"
        );

        assertNotNull(savedUser.getId());

        User foundUser =
                userRepository.findById(savedUser.getId())
                        .orElseThrow();

        assertEquals(
                "Abina",
                foundUser.getName()
        );

        assertEquals(
                "abina@test.com",
                foundUser.getEmail()
        );

        assertEquals(
                "USER",
                foundUser.getRole()
        );
    }

    @Test
    void shouldCheckIfEmailExists() {

        createUser(
                "Abina",
                "abina@test.com",
                "USER"
        );

        assertTrue(
                userRepository.existsByEmail(
                        "abina@test.com"
                )
        );

        assertFalse(
                userRepository.existsByEmail(
                        "unknown@test.com"
                )
        );
    }

    @Test
    void shouldFindUserByEmail() {

        createUser(
                "Abina",
                "abina@test.com",
                "USER"
        );

        Optional<User> result =
                userRepository.findByEmail(
                        "abina@test.com"
                );

        assertTrue(result.isPresent());

        User user = result.get();

        assertEquals(
                "Abina",
                user.getName()
        );

        assertEquals(
                "abina@test.com",
                user.getEmail()
        );
    }

    @Test
    void shouldReturnEmptyWhenEmailDoesNotExist() {

        Optional<User> result =
                userRepository.findByEmail(
                        "unknown@test.com"
                );

        assertTrue(result.isEmpty());
    }

    @Test
    void shouldFindUsersByNameOrEmail() {

        createUser(
                "Abina",
                "abina@test.com",
                "USER"
        );

        createUser(
                "Rahul",
                "rahul@test.com",
                "USER"
        );

        createUser(
                "Anita",
                "anita@example.com",
                "ADMIN"
        );

        Page<User> results =
                userRepository
                        .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                                "abina",
                                "abina",
                                PageRequest.of(0, 10)
                        );

        assertEquals(
                1,
                results.getTotalElements()
        );

        assertEquals(
                "Abina",
                results.getContent()
                        .get(0)
                        .getName()
        );
    }

    @Test
    void shouldFindUserWhenEmailMatchesSearch() {

        createUser(
                "Abina",
                "abina@test.com",
                "USER"
        );

        createUser(
                "Rahul",
                "rahul@test.com",
                "USER"
        );

        Page<User> results =
                userRepository
                        .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                                "xyz",
                                "rahul",
                                PageRequest.of(0, 10)
                        );

        assertEquals(
                1,
                results.getTotalElements()
        );

        assertEquals(
                "Rahul",
                results.getContent()
                        .get(0)
                        .getName()
        );
    }

    @Test
    void shouldReturnEmptyPageWhenSearchDoesNotMatch() {

        createUser(
                "Abina",
                "abina@test.com",
                "USER"
        );

        Page<User> results =
                userRepository
                        .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                                "xyz",
                                "xyz",
                                PageRequest.of(0, 10)
                        );

        assertEquals(
                0,
                results.getTotalElements()
        );

        assertTrue(
                results.getContent().isEmpty()
        );
    }

    @Test
    void shouldSupportPagination() {

        createUser(
                "User One",
                "one@test.com",
                "USER"
        );

        createUser(
                "User Two",
                "two@test.com",
                "USER"
        );

        createUser(
                "User Three",
                "three@test.com",
                "USER"
        );

        Page<User> firstPage =
                userRepository.findAll(
                        PageRequest.of(0, 2)
                );

        assertEquals(
                3,
                firstPage.getTotalElements()
        );

        assertEquals(
                2,
                firstPage.getContent().size()
        );

        Page<User> secondPage =
                userRepository.findAll(
                        PageRequest.of(1, 2)
                );

        assertEquals(
                1,
                secondPage.getContent().size()
        );
    }
}