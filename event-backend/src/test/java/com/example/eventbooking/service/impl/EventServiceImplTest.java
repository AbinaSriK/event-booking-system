package com.example.eventbooking.service.impl;

import com.example.eventbooking.dto.request.CreateEventRequest;
import com.example.eventbooking.dto.response.EventResponse;
import com.example.eventbooking.exception.ResourceNotFoundException;
import com.example.eventbooking.model.Event;
import com.example.eventbooking.repository.EventRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceImplTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventServiceImpl eventService;

    @Test // test for creating an event success
    void createEvent_shouldCreateAndReturnEvent() {

        CreateEventRequest request = createRequest();

        Event savedEvent = createEvent(1L);

        when(eventRepository.save(any(Event.class)))
                .thenReturn(savedEvent);

        EventResponse response = eventService.createEvent(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Java Conference", response.getTitle());
        assertEquals("Chennai", response.getLocation());
        assertEquals(100, response.getTotalSeats());
        assertEquals(100, response.getAvailableSeats());
        assertEquals(
                BigDecimal.valueOf(500),
                response.getTicketPrice()
        );

        verify(eventRepository, times(1))
                .save(any(Event.class));
    }

    @Test // a success get event by id
    void getEventById_shouldReturnEventWhenEventExists() {

        Long eventId = 1L;

        Event event = createEvent(eventId);

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.of(event));

        EventResponse response =
                eventService.getEventById(eventId);

        assertNotNull(response);
        assertEquals(eventId, response.getId());
        assertEquals("Java Conference", response.getTitle());
        assertEquals("Chennai", response.getLocation());

        verify(eventRepository, times(1))
                .findById(eventId);
    }



    @Test // test when get event by id not found
    void getEventById_shouldThrowExceptionWhenEventDoesNotExist() {

        Long eventId = 999L;

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> eventService.getEventById(eventId)
                );

        assertEquals(
                "Event not found with id: 999",
                exception.getMessage()
        );

        verify(eventRepository, times(1))
                .findById(eventId);
    }

    @Test // test for updating an event successfully
    void updateEvent_shouldUpdateAndReturnEvent() {

        Long eventId = 1L;

        Event existingEvent = createEvent(eventId);

        CreateEventRequest request = createRequest();

        request.setTitle("Updated Java Conference");
        request.setLocation("Bangalore");
        request.setTotalSeats(200);
        request.setTicketPrice(BigDecimal.valueOf(750));

        Event updatedEvent = createEvent(eventId);

        updatedEvent.setTitle("Updated Java Conference");
        updatedEvent.setLocation("Bangalore");
        updatedEvent.setTotalSeats(200);
        updatedEvent.setTicketPrice(BigDecimal.valueOf(750));

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.of(existingEvent));

        when(eventRepository.save(any(Event.class)))
                .thenReturn(updatedEvent);

        EventResponse response =
                eventService.updateEvent(eventId, request);

        assertNotNull(response);
        assertEquals(eventId, response.getId());
        assertEquals(
                "Updated Java Conference",
                response.getTitle()
        );
        assertEquals("Bangalore", response.getLocation());
        assertEquals(200, response.getTotalSeats());
        assertEquals(
                BigDecimal.valueOf(750),
                response.getTicketPrice()
        );

        verify(eventRepository, times(1))
                .findById(eventId);

        verify(eventRepository, times(1))
                .save(any(Event.class));
    }

    @Test // test for updating a event when it is not found
    void updateEvent_shouldThrowExceptionWhenEventDoesNotExist() {

        Long eventId = 999L;

        CreateEventRequest request = createRequest();

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> eventService.updateEvent(
                                eventId,
                                request
                        )
                );

        assertEquals(
                "Event not found with id: 999",
                exception.getMessage()
        );

        verify(eventRepository, times(1))
                .findById(eventId);

        verify(eventRepository, never())
                .save(any(Event.class));
    }

    @Test // test for deleting an event successfully
    void deleteEvent_shouldDeleteEventWhenEventExists() {

        Long eventId = 1L;

        Event event = createEvent(eventId);

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.of(event));

        eventService.deleteEvent(eventId);

        verify(eventRepository, times(1))
                .findById(eventId);

        verify(eventRepository, times(1))
                .delete(event);
    }

    @Test // test for deleting event is not found
    void deleteEvent_shouldThrowExceptionWhenEventDoesNotExist() {

        Long eventId = 999L;

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> eventService.deleteEvent(eventId)
                );

        assertEquals(
                "Event not found with id: 999",
                exception.getMessage()
        );

        verify(eventRepository, times(1))
                .findById(eventId);

        verify(eventRepository, never())
                .delete(any(Event.class));
    }

    @Test // test for getting all events without any filter
    void getAllEvents_shouldReturnAllEvents() {

        Event event1 = createEvent(1L);
        Event event2 = createEvent(2L);

        Page<Event> eventPage =
                new PageImpl<>(List.of(event1, event2));

        when(eventRepository.findAll(any(Pageable.class)))
                .thenReturn(eventPage);

        Page<EventResponse> response =
                eventService.getAllEvents(
                        0,
                        10,
                        "title",
                        null,
                        null
                );

        assertNotNull(response);
        assertEquals(2, response.getTotalElements());
        assertEquals(
                "Java Conference",
                response.getContent().get(0).getTitle()
        );

        verify(eventRepository, times(1))
                .findAll(any(Pageable.class));
    }

    @Test // getting all events with title filter
    void getAllEvents_shouldFilterByTitle() {

        Event event = createEvent(1L);

        Page<Event> eventPage =
                new PageImpl<>(List.of(event));

        when(eventRepository
                .findByTitleContainingIgnoreCase(
                        eq("Java"),
                        any(Pageable.class)
                ))
                .thenReturn(eventPage);

        Page<EventResponse> response =
                eventService.getAllEvents(
                        0,
                        10,
                        "title",
                        "Java",
                        null
                );

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(
                "Java Conference",
                response.getContent().get(0).getTitle()
        );

        verify(eventRepository, times(1))
                .findByTitleContainingIgnoreCase(
                        eq("Java"),
                        any(Pageable.class)
                );
    }

    @Test // getting all events with location filter
    void getAllEvents_shouldFilterByLocation() {

        Event event = createEvent(1L);

        Page<Event> eventPage =
                new PageImpl<>(List.of(event));

        when(eventRepository
                .findByLocationContainingIgnoreCase(
                        eq("Chennai"),
                        any(Pageable.class)
                ))
                .thenReturn(eventPage);

        Page<EventResponse> response =
                eventService.getAllEvents(
                        0,
                        10,
                        "title",
                        null,
                        "Chennai"
                );

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());

        verify(eventRepository, times(1))
                .findByLocationContainingIgnoreCase(
                        eq("Chennai"),
                        any(Pageable.class)
                );
    }

    @Test // get all events with title + location filter
    void getAllEvents_shouldFilterByTitleAndLocation() {

        Event event = createEvent(1L);

        Page<Event> eventPage =
                new PageImpl<>(List.of(event));

        when(eventRepository
                .findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(
                        eq("Java"),
                        eq("Chennai"),
                        any(Pageable.class)
                ))
                .thenReturn(eventPage);

        Page<EventResponse> response =
                eventService.getAllEvents(
                        0,
                        10,
                        "title",
                        "Java",
                        "Chennai"
                );

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());

        verify(eventRepository, times(1))
                .findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(
                        eq("Java"),
                        eq("Chennai"),
                        any(Pageable.class)
                );
    }

    private CreateEventRequest createRequest() {

        CreateEventRequest request =
                new CreateEventRequest();

        request.setTitle("Java Conference");
        request.setDescription(
                "Java and Spring Boot Conference"
        );
        request.setLocation("Chennai");
        request.setEventDate(
                LocalDateTime.now().plusDays(10)
        );
        request.setTotalSeats(100);
        request.setTicketPrice(
                BigDecimal.valueOf(500)
        );

        return request;
    }

    private Event createEvent(Long id) {

        Event event = new Event();

        event.setId(id);
        event.setTitle("Java Conference");
        event.setDescription(
                "Java and Spring Boot Conference"
        );
        event.setLocation("Chennai");
        event.setEventDate(
                LocalDateTime.now().plusDays(10)
        );
        event.setTotalSeats(100);
        event.setAvailableSeats(100);
        event.setTicketPrice(
                BigDecimal.valueOf(500)
        );

        return event;
    }
}