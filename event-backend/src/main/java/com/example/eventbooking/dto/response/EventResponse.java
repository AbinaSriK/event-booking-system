package com.example.eventbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private Long id;

    private String title;

    private String description;

    private String location;

    private LocalDateTime eventDate;

    private Integer totalSeats;

    private Integer availableSeats;

    private BigDecimal ticketPrice;
}