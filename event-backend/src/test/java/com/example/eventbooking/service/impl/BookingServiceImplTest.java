package com.example.eventbooking.service.impl;

import com.example.eventbooking.dto.response.BookingResponse;
import com.example.eventbooking.exception.ResourceNotFoundException;
import com.example.eventbooking.model.Booking;
import com.example.eventbooking.model.Event;
import com.example.eventbooking.model.User;
import com.example.eventbooking.repository.BookingRepository;
import com.example.eventbooking.repository.EventRepository;
import com.example.eventbooking.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    @Test // create booking
    void createBooking_shouldCreateBookingSuccessfully() {

        Long userId = 1L;
        Long eventId = 10L;
        Integer seats = 3;

        User user = createUser(userId);
        Event event = createEvent(eventId, 100, BigDecimal.valueOf(500));

        Booking savedBooking = createBooking(
                1L,
                user,
                event,
                seats,
                BigDecimal.valueOf(1500),
                "CONFIRMED"
        );

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.of(event));

        when(bookingRepository.save(any(Booking.class)))
                .thenReturn(savedBooking);

        Booking result = bookingService.createBooking(
                userId,
                eventId,
                seats
        );

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(user, result.getUser());
        assertEquals(event, result.getEvent());
        assertEquals(3, result.getNumberOfSeats());
        assertEquals(
                BigDecimal.valueOf(1500),
                result.getTotalAmount()
        );
        assertEquals("CONFIRMED", result.getStatus());

        assertEquals(97, event.getAvailableSeats());

        verify(userRepository, times(1))
                .findById(userId);

        verify(eventRepository, times(1))
                .findById(eventId);

        verify(eventRepository, times(1))
                .save(event);

        verify(bookingRepository, times(1))
                .save(any(Booking.class));
    }


    @Test
    void createBooking_shouldThrowExceptionWhenUserDoesNotExist() {

        Long userId = 999L;
        Long eventId = 10L;

        when(userRepository.findById(userId))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> bookingService.createBooking(
                                userId,
                                eventId,
                                2
                        )
                );

        assertEquals(
                "User not found with id: 999",
                exception.getMessage()
        );

        verify(userRepository, times(1))
                .findById(userId);

        verify(eventRepository, never())
                .findById(anyLong());

        verify(bookingRepository, never())
                .save(any(Booking.class));
    }


    @Test
    void createBooking_shouldThrowExceptionWhenEventDoesNotExist() {

        Long userId = 1L;
        Long eventId = 999L;

        User user = createUser(userId);

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> bookingService.createBooking(
                                userId,
                                eventId,
                                2
                        )
                );

        assertEquals(
                "Event not found with id: 999",
                exception.getMessage()
        );

        verify(userRepository, times(1))
                .findById(userId);

        verify(eventRepository, times(1))
                .findById(eventId);

        verify(eventRepository, never())
                .save(any(Event.class));

        verify(bookingRepository, never())
                .save(any(Booking.class));
    }


    @Test
    void createBooking_shouldThrowExceptionWhenSeatsAreInsufficient() {

        Long userId = 1L;
        Long eventId = 10L;

        User user = createUser(userId);

        // Only 2 seats available
        Event event = createEvent(
                eventId,
                2,
                BigDecimal.valueOf(500)
        );

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.of(event));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> bookingService.createBooking(
                                userId,
                                eventId,
                                5
                        )
                );

        assertEquals(
                "Not enough seats available",
                exception.getMessage()
        );

        // Seats should remain unchanged
        assertEquals(2, event.getAvailableSeats());

        verify(eventRepository, never())
                .save(any(Event.class));

        verify(bookingRepository, never())
                .save(any(Booking.class));
    }

    @Test
    void getBookingsByUser_shouldReturnBookingsSuccessfully() {

        Long userId = 1L;

        User user = createUser(userId);
        Event event = createEvent(
                10L,
                100,
                BigDecimal.valueOf(500)
        );

        Booking booking = createBooking(
                1L,
                user,
                event,
                2,
                BigDecimal.valueOf(1000),
                "CONFIRMED"
        );

        Page<Booking> bookingPage =
                new PageImpl<>(List.of(booking));

        when(userRepository.existsById(userId))
                .thenReturn(true);

        when(bookingRepository.findByUserId(
                eq(userId),
                any(Pageable.class)
        )).thenReturn(bookingPage);

        Page<BookingResponse> result =
                bookingService.getBookingsByUser(
                        userId,
                        0,
                        10
                );

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());

        BookingResponse response =
                result.getContent().get(0);

        assertEquals(1L, response.getId());
        assertEquals(1L, response.getUserId());
        assertEquals(10L, response.getEventId());
        assertEquals(2, response.getNumberOfSeats());
        assertEquals(
                BigDecimal.valueOf(1000),
                response.getTotalAmount()
        );
        assertEquals("CONFIRMED", response.getStatus());

        verify(userRepository, times(1))
                .existsById(userId);

        verify(bookingRepository, times(1))
                .findByUserId(
                        eq(userId),
                        any(Pageable.class)
                );
    }


    @Test
    void getBookingsByUser_shouldThrowExceptionWhenUserDoesNotExist() {

        Long userId = 999L;

        when(userRepository.existsById(userId))
                .thenReturn(false);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> bookingService.getBookingsByUser(
                                userId,
                                0,
                                10
                        )
                );

        assertEquals(
                "User not found with id: 999",
                exception.getMessage()
        );

        verify(userRepository, times(1))
                .existsById(userId);

        verify(bookingRepository, never())
                .findByUserId(
                        anyLong(),
                        any(Pageable.class)
                );
    }

    @Test
    void cancelBooking_shouldCancelBookingSuccessfully() {

        Long bookingId = 1L;
        Long userId = 1L;

        User user = createUser(userId);

        Event event = createEvent(
                10L,
                97,
                BigDecimal.valueOf(500)
        );

        Booking booking = createBooking(
                bookingId,
                user,
                event,
                3,
                BigDecimal.valueOf(1500),
                "CONFIRMED"
        );

        Booking cancelledBooking = createBooking(
                bookingId,
                user,
                event,
                3,
                BigDecimal.valueOf(1500),
                "CANCELLED"
        );

        when(bookingRepository.findById(bookingId))
                .thenReturn(Optional.of(booking));

        when(bookingRepository.save(any(Booking.class)))
                .thenReturn(cancelledBooking);

        BookingResponse response =
                bookingService.cancelBooking(
                        bookingId,
                        userId
                );

        assertNotNull(response);

        assertEquals(
                bookingId,
                response.getId()
        );

        assertEquals(
                userId,
                response.getUserId()
        );

        assertEquals(
                10L,
                response.getEventId()
        );

        assertEquals(
                3,
                response.getNumberOfSeats()
        );

        assertEquals(
                "CANCELLED",
                response.getStatus()
        );

        // 97 + 3 = 100
        assertEquals(
                100,
                event.getAvailableSeats()
        );

        // Booking should have been changed to CANCELLED
        assertEquals(
                "CANCELLED",
                booking.getStatus()
        );

        verify(bookingRepository, times(1))
                .findById(bookingId);

        verify(eventRepository, times(1))
                .save(event);

        verify(bookingRepository, times(1))
                .save(booking);
    }


    @Test
    void cancelBooking_shouldThrowExceptionWhenBookingDoesNotExist() {

        Long bookingId = 999L;
        Long userId = 1L;

        when(bookingRepository.findById(bookingId))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> bookingService.cancelBooking(
                                bookingId,
                                userId
                        )
                );

        assertEquals(
                "Booking not found with id: 999",
                exception.getMessage()
        );

        verify(bookingRepository, times(1))
                .findById(bookingId);

        verify(eventRepository, never())
                .save(any(Event.class));

        verify(bookingRepository, never())
                .save(any(Booking.class));
    }


    @Test
    void cancelBooking_shouldThrowExceptionWhenUserDoesNotOwnBooking() {

        Long bookingId = 1L;
        Long ownerId = 1L;
        Long differentUserId = 2L;

        User owner = createUser(ownerId);

        Event event = createEvent(
                10L,
                97,
                BigDecimal.valueOf(500)
        );

        Booking booking = createBooking(
                bookingId,
                owner,
                event,
                3,
                BigDecimal.valueOf(1500),
                "CONFIRMED"
        );

        when(bookingRepository.findById(bookingId))
                .thenReturn(Optional.of(booking));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> bookingService.cancelBooking(
                                bookingId,
                                differentUserId
                        )
                );

        assertEquals(
                "You are not allowed to cancel this booking",
                exception.getMessage()
        );

        // Nothing should be changed
        assertEquals(97, event.getAvailableSeats());
        assertEquals("CONFIRMED", booking.getStatus());

        verify(bookingRepository, times(1))
                .findById(bookingId);

        verify(eventRepository, never())
                .save(any(Event.class));

        verify(bookingRepository, never())
                .save(any(Booking.class));
    }


    @Test
    void cancelBooking_shouldThrowExceptionWhenBookingAlreadyCancelled() {

        Long bookingId = 1L;
        Long userId = 1L;

        User user = createUser(userId);

        Event event = createEvent(
                10L,
                100,
                BigDecimal.valueOf(500)
        );

        Booking booking = createBooking(
                bookingId,
                user,
                event,
                3,
                BigDecimal.valueOf(1500),
                "CANCELLED"
        );

        when(bookingRepository.findById(bookingId))
                .thenReturn(Optional.of(booking));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> bookingService.cancelBooking(
                                bookingId,
                                userId
                        )
                );

        assertEquals(
                "Booking is already cancelled",
                exception.getMessage()
        );

        assertEquals(100, event.getAvailableSeats());
        assertEquals("CANCELLED", booking.getStatus());

        verify(bookingRepository, times(1))
                .findById(bookingId);

        verify(eventRepository, never())
                .save(any(Event.class));

        verify(bookingRepository, never())
                .save(any(Booking.class));
    }


    // ---------------------------------------------------------
    // HELPER METHODS
    // ---------------------------------------------------------

    private User createUser(Long id) {

        User user = new User();
        user.setId(id);

        return user;
    }


    private Event createEvent(
            Long id,
            Integer availableSeats,
            BigDecimal ticketPrice) {

        Event event = new Event();

        event.setId(id);
        event.setTitle("Java Conference");
        event.setDescription("Java and Spring Boot Conference");
        event.setLocation("Chennai");
        event.setEventDate(
                LocalDateTime.now().plusDays(10)
        );

        event.setTotalSeats(100);
        event.setAvailableSeats(availableSeats);
        event.setTicketPrice(ticketPrice);

        return event;
    }


    private Booking createBooking(
            Long id,
            User user,
            Event event,
            Integer numberOfSeats,
            BigDecimal totalAmount,
            String status) {

        Booking booking = new Booking();

        booking.setId(id);
        booking.setUser(user);
        booking.setEvent(event);
        booking.setNumberOfSeats(numberOfSeats);
        booking.setTotalAmount(totalAmount);
        booking.setBookingDate(
                LocalDateTime.now()
        );
        booking.setStatus(status);

        return booking;
    }
}