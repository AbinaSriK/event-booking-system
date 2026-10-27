package com.example.eventbooking.controller;

import com.example.eventbooking.dto.request.CreateBookingRequest;
import com.example.eventbooking.dto.response.BookingResponse;
import com.example.eventbooking.exception.GlobalExceptionHandler;
import com.example.eventbooking.exception.ResourceNotFoundException;
import com.example.eventbooking.model.Booking;
import com.example.eventbooking.model.Event;
import com.example.eventbooking.model.User;
import com.example.eventbooking.service.BookingService;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class BookingControllerTest {

    @Mock
    private BookingService bookingService;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {

        objectMapper = new ObjectMapper();

        BookingController bookingController =
                new BookingController(bookingService);

        mockMvc = MockMvcBuilders
                .standaloneSetup(bookingController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void createBooking_shouldReturnCreated() throws Exception {

        CreateBookingRequest request =
                new CreateBookingRequest();

        request.setUserId(1L);
        request.setEventId(1L);
        request.setNumberOfSeats(2);

        User user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setRole("USER");

        Event event = new Event();
        event.setId(1L);
        event.setTitle("Tech Conference");
        event.setLocation("Chennai");
        event.setTicketPrice(new BigDecimal("500"));

        Booking booking = new Booking();

        booking.setId(1L);
        booking.setUser(user);
        booking.setEvent(event);
        booking.setNumberOfSeats(2);
        booking.setTotalAmount(new BigDecimal("1000"));
        booking.setBookingDate(
                LocalDateTime.of(2026, 12, 10, 10, 0)
        );
        booking.setStatus("CONFIRMED");

        when(
                bookingService.createBooking(
                        1L,
                        1L,
                        2
                )
        ).thenReturn(booking);

        mockMvc.perform(
                        post("/api/bookings")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.eventId").value(1))
                .andExpect(jsonPath("$.numberOfSeats").value(2))
                .andExpect(jsonPath("$.totalAmount").value(1000))
                .andExpect(jsonPath("$.status")
                        .value("CONFIRMED"));

        verify(bookingService).createBooking(
                1L,
                1L,
                2
        );
    }

    @Test
    void getBookingsByUser_shouldReturnBookings() throws Exception {

        BookingResponse response =
                new BookingResponse(
                        1L,
                        1L,
                        1L,
                        2,
                        new BigDecimal("1000"),
                        LocalDateTime.of(2026, 12, 10, 10, 0),
                        "CONFIRMED"
                );

        Page<BookingResponse> responsePage =
                new PageImpl<>(
                        List.of(response),
                        PageRequest.of(0, 10),
                        1
                );

        when(
                bookingService.getBookingsByUser(
                        eq(1L),
                        eq(0),
                        eq(10)
                )
        ).thenReturn(responsePage);

        mockMvc.perform(
                        get("/api/bookings/user/1")
                                .param("page", "0")
                                .param("size", "10")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id")
                        .value(1))
                .andExpect(jsonPath("$.content[0].userId")
                        .value(1))
                .andExpect(jsonPath("$.content[0].eventId")
                        .value(1))
                .andExpect(jsonPath("$.content[0].numberOfSeats")
                        .value(2))
                .andExpect(jsonPath("$.content[0].status")
                        .value("CONFIRMED"));

        verify(bookingService).getBookingsByUser(
                1L,
                0,
                10
        );
    }

    @Test
    void getBookingsByUser_shouldReturnNotFound() throws Exception {

        when(
                bookingService.getBookingsByUser(
                        99L,
                        0,
                        10
                )
        ).thenThrow(
                new ResourceNotFoundException(
                        "User not found with id: 99"
                )
        );

        mockMvc.perform(
                        get("/api/bookings/user/99")
                                .param("page", "0")
                                .param("size", "10")
                )
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error")
                        .value("Not Found"))
                .andExpect(jsonPath("$.message")
                        .value("User not found with id: 99"));

        verify(bookingService).getBookingsByUser(
                99L,
                0,
                10
        );
    }

    @Test
    void cancelBooking_shouldReturnCancelledBooking()
            throws Exception {

        BookingResponse response =
                new BookingResponse(
                        1L,
                        1L,
                        1L,
                        2,
                        new BigDecimal("1000"),
                        LocalDateTime.of(2026, 12, 10, 10, 0),
                        "CANCELLED"
                );

        when(
                bookingService.cancelBooking(
                        1L,
                        1L
                )
        ).thenReturn(response);

        mockMvc.perform(
                        put("/api/bookings/1/cancel")
                                .param("userId", "1")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id")
                        .value(1))
                .andExpect(jsonPath("$.userId")
                        .value(1))
                .andExpect(jsonPath("$.eventId")
                        .value(1))
                .andExpect(jsonPath("$.numberOfSeats")
                        .value(2))
                .andExpect(jsonPath("$.status")
                        .value("CANCELLED"));

        verify(bookingService).cancelBooking(
                1L,
                1L
        );
    }
}