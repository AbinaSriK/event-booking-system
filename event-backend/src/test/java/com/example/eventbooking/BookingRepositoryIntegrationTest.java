package com.example.eventbooking;

import com.example.eventbooking.model.Booking;
import com.example.eventbooking.model.Event;
import com.example.eventbooking.model.User;
import com.example.eventbooking.repository.BookingRepository;
import com.example.eventbooking.repository.EventRepository;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
class BookingRepositoryIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16");

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @BeforeAll
    static void setTimezone() {
        java.util.TimeZone.setDefault(
                java.util.TimeZone.getTimeZone("UTC")
        );
    }

    @BeforeEach
    void cleanDatabase() {
        bookingRepository.deleteAll();
        eventRepository.deleteAll();
        userRepository.deleteAll();
    }

    private User createUser(String name, String email) {

        User user = new User();

        user.setName(name);
        user.setEmail(email);
        user.setPassword("password123");
        user.setRole("USER");

        return userRepository.save(user);
    }

    private Event createEvent(String title) {

        Event event = new Event();

        event.setTitle(title);
        event.setDescription("Technology event");
        event.setLocation("Chennai");
        event.setEventDate(
                LocalDateTime.of(2026, 12, 10, 10, 0)
        );
        event.setTotalSeats(100);
        event.setAvailableSeats(100);
        event.setTicketPrice(
                BigDecimal.valueOf(500)
        );

        return eventRepository.save(event);
    }

    private Booking createBooking(
            User user,
            Event event,
            int seats
    ) {

        Booking booking = new Booking();

        booking.setUser(user);
        booking.setEvent(event);
        booking.setNumberOfSeats(seats);
        booking.setTotalAmount(
                event.getTicketPrice()
                        .multiply(BigDecimal.valueOf(seats))
        );
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("CONFIRMED");

        return booking;
    }

    @Test
    void shouldSaveAndRetrieveBooking() {

        User user = createUser(
                "Abina",
                "abina@test.com"
        );

        Event event = createEvent(
                "Spring Boot Conference"
        );

        Booking booking =
                createBooking(user, event, 2);

        Booking savedBooking =
                bookingRepository.save(booking);

        assertNotNull(savedBooking.getId());

        Booking foundBooking =
                bookingRepository.findById(
                        savedBooking.getId()
                ).orElseThrow();

        assertEquals(
                user.getId(),
                foundBooking.getUser().getId()
        );

        assertEquals(
                event.getId(),
                foundBooking.getEvent().getId()
        );

        assertEquals(
                2,
                foundBooking.getNumberOfSeats()
        );

        assertEquals(
                0,
                BigDecimal.valueOf(1000) .compareTo(foundBooking.getTotalAmount())
        );

        assertEquals(
                "CONFIRMED",
                foundBooking.getStatus()
        );
    }

    @Test
    void shouldFindBookingsByUserId() {

        User user = createUser(
                "Abina",
                "abina@test.com"
        );

        Event event = createEvent(
                "Spring Boot Conference"
        );

        bookingRepository.save(
                createBooking(user, event, 2)
        );

        Page<Booking> results =
                bookingRepository.findByUserId(
                        user.getId(),
                        PageRequest.of(0, 10)
                );

        assertEquals(
                1,
                results.getTotalElements()
        );

        assertEquals(
                user.getId(),
                results.getContent()
                        .get(0)
                        .getUser()
                        .getId()
        );
    }

    @Test
    void shouldFindMultipleBookingsForSameUser() {

        User user = createUser(
                "Abina",
                "abina@test.com"
        );

        Event event1 = createEvent(
                "Spring Boot Conference"
        );

        Event event2 = createEvent(
                "Java Developer Meetup"
        );

        bookingRepository.save(
                createBooking(user, event1, 2)
        );

        bookingRepository.save(
                createBooking(user, event2, 3)
        );

        Page<Booking> results =
                bookingRepository.findByUserId(
                        user.getId(),
                        PageRequest.of(0, 10)
                );

        assertEquals(
                2,
                results.getTotalElements()
        );

        assertEquals(
                2,
                results.getContent().size()
        );
    }

    @Test
    void shouldReturnEmptyPageForUserWithNoBookings() {

        User user = createUser(
                "Abina",
                "nobooking@test.com"
        );

        Page<Booking> results =
                bookingRepository.findByUserId(
                        user.getId(),
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
    void shouldCheckIfUserHasBookings() {

        User user = createUser(
                "Abina",
                "exists@test.com"
        );

        Event event = createEvent(
                "Spring Boot Conference"
        );

        assertFalse(
                bookingRepository.existsByUserId(
                        user.getId()
                )
        );

        bookingRepository.save(
                createBooking(user, event, 2)
        );

        assertTrue(
                bookingRepository.existsByUserId(
                        user.getId()
                )
        );
    }

    @Test
    void shouldReturnFalseForNonExistingUser() {

        assertFalse(
                bookingRepository.existsByUserId(999999L)
        );
    }

    @Test
    void shouldSupportPaginationForUserBookings() {

        User user = createUser(
                "Abina",
                "pagination@test.com"
        );

        Event event1 = createEvent("Event 1");
        Event event2 = createEvent("Event 2");
        Event event3 = createEvent("Event 3");

        bookingRepository.save(
                createBooking(user, event1, 1)
        );

        bookingRepository.save(
                createBooking(user, event2, 2)
        );

        bookingRepository.save(
                createBooking(user, event3, 3)
        );

        Page<Booking> firstPage =
                bookingRepository.findByUserId(
                        user.getId(),
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

        Page<Booking> secondPage =
                bookingRepository.findByUserId(
                        user.getId(),
                        PageRequest.of(1, 2)
                );

        assertEquals(
                1,
                secondPage.getContent().size()
        );
    }
}