package com.example.eventbooking.service.impl;

import com.example.eventbooking.dto.response.BookingResponse;
import com.example.eventbooking.dto.request.CreateBookingRequest;
import com.example.eventbooking.exception.ResourceNotFoundException;
import com.example.eventbooking.model.Booking;
import com.example.eventbooking.model.Event;
import com.example.eventbooking.model.User;
import com.example.eventbooking.repository.BookingRepository;
import com.example.eventbooking.repository.EventRepository;
import com.example.eventbooking.repository.UserRepository;
import com.example.eventbooking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private static final Logger log =
            LoggerFactory.getLogger(BookingServiceImpl.class);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    @Override
    @Transactional
    public Booking createBooking(
            Long userId,
            Long eventId,
            Integer numberOfSeats) {

        log.info(
                "Creating booking - userId: {}, eventId: {}, seats: {}",
                userId,
                eventId,
                numberOfSeats
        );

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found with id: {}", userId);
                    return new ResourceNotFoundException(
                            "User not found with id: " + userId);
                });

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    log.warn("Event not found with id: {}", eventId);
                    return new ResourceNotFoundException(
                            "Event not found with id: " + eventId);
                });

        if (event.getAvailableSeats() < numberOfSeats) {

            log.warn(
                    "Insufficient seats for eventId: {}. Requested: {}, Available: {}",
                    eventId,
                    numberOfSeats,
                    event.getAvailableSeats()
            );

            throw new IllegalArgumentException(
                    "Not enough seats available");
        }

        BigDecimal totalAmount =
                event.getTicketPrice()
                        .multiply(BigDecimal.valueOf(numberOfSeats));

        event.setAvailableSeats(
                event.getAvailableSeats() - numberOfSeats
        );

        eventRepository.save(event);

        Booking booking = new Booking();

        booking.setUser(user);
        booking.setEvent(event);
        booking.setNumberOfSeats(numberOfSeats);
        booking.setTotalAmount(totalAmount);
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("CONFIRMED");

        Booking savedBooking = bookingRepository.save(booking);

        log.info(
                "Booking created successfully with id: {}",
                savedBooking.getId()
        );

        return savedBooking;
    }

    @Override
    public Page<BookingResponse> getBookingsByUser(
            Long userId,
            int page,
            int size) {

        log.info(
                "Fetching bookings for userId: {}, page: {}, size: {}",
                userId,
                page,
                size
        );

        if (!userRepository.existsById(userId)) {

            log.warn("User not found while fetching bookings: {}", userId);

            throw new ResourceNotFoundException(
                    "User not found with id: " + userId);
        }

        Pageable pageable = PageRequest.of(page, size);

        Page<Booking> bookings =
                bookingRepository.findByUserId(userId, pageable);

        log.info(
                "Found {} bookings for userId: {}",
                bookings.getTotalElements(),
                userId
        );

        return bookings.map(this::mapToResponse);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(
            Long bookingId,
            Long userId) {

        log.info(
                "Cancelling booking - bookingId: {}, userId: {}",
                bookingId,
                userId
        );

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> {
                    log.warn(
                            "Booking not found with id: {}",
                            bookingId
                    );

                    return new ResourceNotFoundException(
                            "Booking not found with id: " + bookingId);
                });

        if (!booking.getUser().getId().equals(userId)) {

            log.warn(
                    "User {} attempted to cancel booking {} owned by another user",
                    userId,
                    bookingId
            );

            throw new IllegalArgumentException(
                    "You are not allowed to cancel this booking");
        }

        if ("CANCELLED".equals(booking.getStatus())) {

            log.warn(
                    "Booking {} is already cancelled",
                    bookingId
            );

            throw new IllegalArgumentException(
                    "Booking is already cancelled");
        }

        Event event = booking.getEvent();

        event.setAvailableSeats(
                event.getAvailableSeats()
                        + booking.getNumberOfSeats()
        );

        eventRepository.save(event);

        booking.setStatus("CANCELLED");

        Booking cancelledBooking =
                bookingRepository.save(booking);

        log.info(
                "Booking cancelled successfully with id: {}",
                bookingId
        );

        return mapToResponse(cancelledBooking);
    }

    private BookingResponse mapToResponse(Booking booking) {

        return new BookingResponse(
                booking.getId(),
                booking.getUser().getId(),
                booking.getEvent().getId(),
                booking.getNumberOfSeats(),
                booking.getTotalAmount(),
                booking.getBookingDate(),
                booking.getStatus()
        );
    }
}