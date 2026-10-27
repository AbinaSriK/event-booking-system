package com.example.eventbooking.controller;

import com.example.eventbooking.dto.request.CreateBookingRequest;
import com.example.eventbooking.dto.response.BookingResponse;
import com.example.eventbooking.model.Booking;
import com.example.eventbooking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody CreateBookingRequest request) {

        Booking booking = bookingService.createBooking(
                request.getUserId(),
                request.getEventId(),
                request.getNumberOfSeats()
        );

        BookingResponse response = new BookingResponse(
                booking.getId(),
                booking.getUser().getId(),
                booking.getEvent().getId(),
                booking.getNumberOfSeats(),
                booking.getTotalAmount(),
                booking.getBookingDate(),
                booking.getStatus()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<
            org.springframework.data.domain.Page<BookingResponse>>
    getBookingsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                bookingService.getBookingsByUser(
                        userId,
                        page,
                        size
                )
        );
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long bookingId,
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                bookingService.cancelBooking(
                        bookingId,
                        userId
                )
        );
    }
}