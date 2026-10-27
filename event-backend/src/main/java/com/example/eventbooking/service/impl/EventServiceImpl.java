package com.example.eventbooking.service.impl;

import com.example.eventbooking.dto.request.CreateEventRequest;
import com.example.eventbooking.dto.response.EventResponse;
import com.example.eventbooking.exception.ResourceNotFoundException;
import com.example.eventbooking.model.Event;
import com.example.eventbooking.repository.EventRepository;
import com.example.eventbooking.service.EventService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private static final Logger log =
            LoggerFactory.getLogger(EventServiceImpl.class);

    private final EventRepository eventRepository;

    @Override
    public EventResponse createEvent(CreateEventRequest request) {

        log.info("Creating event: {}", request.getTitle());

        Event event = new Event();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());
        event.setTotalSeats(request.getTotalSeats());
        event.setAvailableSeats(request.getTotalSeats());
        event.setTicketPrice(request.getTicketPrice());

        Event savedEvent = eventRepository.save(event);

        log.info("Event created successfully with id: {}",
                savedEvent.getId());

        return mapToResponse(savedEvent);
    }

    @Override
    public Page<EventResponse> getAllEvents(
            int page,
            int size,
            String sortBy,
            String title,
            String location) {

        log.info("Fetching events - page: {}, size: {}, sortBy: {}, title: {}, location: {}",
                page, size, sortBy, title, location);

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy).ascending()
        );

        Page<Event> events;

        if (title != null && !title.isBlank()
                && location != null && !location.isBlank()) {

            events = eventRepository
                    .findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(
                            title, location, pageable);

        } else if (title != null && !title.isBlank()) {

            events = eventRepository
                    .findByTitleContainingIgnoreCase(title, pageable);

        } else if (location != null && !location.isBlank()) {

            events = eventRepository
                    .findByLocationContainingIgnoreCase(location, pageable);

        } else {

            events = eventRepository.findAll(pageable);
        }

        log.info("Fetched {} events", events.getTotalElements());

        return events.map(this::mapToResponse);
    }

    @Override
    public EventResponse getEventById(Long id) {

        log.info("Fetching event with id: {}", id);

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Event not found with id: {}", id);
                    return new ResourceNotFoundException(
                            "Event not found with id: " + id);
                });

        return mapToResponse(event);
    }

    @Override
    public EventResponse updateEvent(
            Long id,
            CreateEventRequest request) {

        log.info("Updating event with id: {}", id);

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Event not found for update with id: {}", id);
                    return new ResourceNotFoundException(
                            "Event not found with id: " + id);
                });

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());
        event.setTotalSeats(request.getTotalSeats());
        event.setTicketPrice(request.getTicketPrice());

        Event updatedEvent = eventRepository.save(event);

        log.info("Event updated successfully with id: {}",
                updatedEvent.getId());

        return mapToResponse(updatedEvent);
    }

    @Override
    public void deleteEvent(Long id) {

        log.info("Deleting event with id: {}", id);

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Event not found for deletion with id: {}", id);
                    return new ResourceNotFoundException(
                            "Event not found with id: " + id);
                });

        eventRepository.delete(event);

        log.info("Event deleted successfully with id: {}", id);
    }

    private EventResponse mapToResponse(Event event) {

        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getLocation(),
                event.getEventDate(),
                event.getTotalSeats(),
                event.getAvailableSeats(),
                event.getTicketPrice()
        );
    }
}