package com.example.eventbooking.controller;

import com.example.eventbooking.dto.request.CreateEventRequest;
import com.example.eventbooking.dto.response.EventResponse;
import com.example.eventbooking.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody CreateEventRequest request) {

        EventResponse response = eventService.createEvent(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<Page<EventResponse>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location) {

        return ResponseEntity.ok(
                eventService.getAllEvents(
                        page,
                        size,
                        sortBy,
                        title,
                        location
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(
            @PathVariable Long id) {

        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody CreateEventRequest request) {

        return ResponseEntity.ok(
                eventService.updateEvent(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {

        eventService.deleteEvent(id);

        return ResponseEntity.noContent().build();
    }
}