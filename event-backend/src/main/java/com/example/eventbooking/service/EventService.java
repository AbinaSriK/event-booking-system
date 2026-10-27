package com.example.eventbooking.service;

import com.example.eventbooking.dto.request.CreateEventRequest;
import com.example.eventbooking.dto.response.EventResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface EventService {

    EventResponse createEvent(CreateEventRequest request);

    Page<EventResponse> getAllEvents(
            int page,
            int size,
            String sortBy,
            String title,
            String location);
    EventResponse getEventById(Long id);

    EventResponse updateEvent(Long id, CreateEventRequest request);

    void deleteEvent(Long id);
}