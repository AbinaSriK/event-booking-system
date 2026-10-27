package com.example.eventbooking.service;

import com.example.eventbooking.dto.response.BookingResponse;
import com.example.eventbooking.model.Booking;
import org.springframework.data.domain.Page;

public interface BookingService {

    Booking createBooking(
            Long userId,
            Long eventId,
            Integer numberOfSeats);

    Page<BookingResponse> getBookingsByUser(
            Long userId,
            int page,
            int size);

    BookingResponse cancelBooking(
            Long bookingId,
            Long userId);
}