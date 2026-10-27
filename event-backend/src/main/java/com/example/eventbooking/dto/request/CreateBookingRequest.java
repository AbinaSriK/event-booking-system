package com.example.eventbooking.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBookingRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Number of seats is required")
    @Min(value = 1, message = "Number of seats must be at least 1")
    private Integer numberOfSeats;
}