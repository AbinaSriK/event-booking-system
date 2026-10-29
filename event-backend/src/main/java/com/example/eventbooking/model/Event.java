package com.example.eventbooking.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Column;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Setter
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    private LocalDateTime eventDate;

    private Integer totalSeats;

    private Integer availableSeats;

    private BigDecimal ticketPrice;

}