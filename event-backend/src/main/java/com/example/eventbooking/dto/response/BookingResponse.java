package com.example.eventbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private Long userId;
    private Long eventId;
    private Integer numberOfSeats;
    private BigDecimal totalAmount;
    private LocalDateTime bookingDate;
    private String status;
}