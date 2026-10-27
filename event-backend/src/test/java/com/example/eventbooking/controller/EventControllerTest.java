package com.example.eventbooking.controller;

import com.example.eventbooking.dto.request.CreateEventRequest;
import com.example.eventbooking.dto.response.EventResponse;
import com.example.eventbooking.exception.GlobalExceptionHandler;
import com.example.eventbooking.exception.ResourceNotFoundException;
import com.example.eventbooking.model.Event;
import com.example.eventbooking.service.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class EventControllerTest {

    @Mock
    private EventService eventService;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {

        objectMapper = new ObjectMapper();

        EventController eventController =
                new EventController(eventService);

        mockMvc = MockMvcBuilders
                .standaloneSetup(eventController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void createEvent_shouldReturnCreated() throws Exception {

        CreateEventRequest request = new CreateEventRequest();

        request.setTitle("Tech Conference");
        request.setDescription("Technology event");
        request.setLocation("Chennai");
        request.setEventDate(
                LocalDateTime.of(2026, 12, 10, 10, 0)
        );
        request.setTotalSeats(100);
        request.setTicketPrice(
                new BigDecimal("500")
        );

        EventResponse response =
                new EventResponse(
                        1L,
                        "Tech Conference",
                        "Technology event",
                        "Chennai",
                        LocalDateTime.of(2026, 12, 10, 10, 0),
                        100,
                        100,
                        new BigDecimal("500")
                );

        when(eventService.createEvent(any(CreateEventRequest.class)))
                .thenReturn(response);

        mockMvc.perform(
                        post("/api/events")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Tech Conference"))
                .andExpect(jsonPath("$.location").value("Chennai"));

        verify(eventService).createEvent(any(CreateEventRequest.class));
    }

    @Test
    void getAllEvents_shouldReturnEvents() throws Exception {

        EventResponse response =
                new EventResponse(
                        1L,
                        "Tech Conference",
                        "Technology event",
                        "Chennai",
                        LocalDateTime.of(2026, 12, 10, 10, 0),
                        100,
                        80,
                        new BigDecimal("500")
                );

        Page<EventResponse> responsePage =
                new PageImpl<>(
                        List.of(response),
                        PageRequest.of(0, 10),
                        1
                );

        when(
                eventService.getAllEvents(
                        eq(0),
                        eq(10),
                        eq("id"),
                        nullable(String.class),
                        nullable(String.class)
                )
        ).thenReturn(responsePage);

        mockMvc.perform(
                        get("/api/events")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].title")
                        .value("Tech Conference"))
                .andExpect(jsonPath("$.content[0].location")
                        .value("Chennai"));

        verify(eventService).getAllEvents(
                eq(0),
                eq(10),
                eq("id"),
                nullable(String.class),
                nullable(String.class)
        );
    }

    @Test
    void getEventById_shouldReturnEvent() throws Exception {

        EventResponse response =
                new EventResponse(
                        1L,
                        "Tech Conference",
                        "Technology event",
                        "Chennai",
                        LocalDateTime.of(2026, 12, 10, 10, 0),
                        100,
                        80,
                        new BigDecimal("500")
                );

        when(eventService.getEventById(1L))
                .thenReturn(response);

        mockMvc.perform(
                        get("/api/events/1")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title")
                        .value("Tech Conference"))
                .andExpect(jsonPath("$.location")
                        .value("Chennai"));

        verify(eventService).getEventById(1L);
    }

    @Test
    void getEventById_shouldReturnNotFound() throws Exception {

        when(eventService.getEventById(99L))
                .thenThrow(
                        new ResourceNotFoundException(
                                "Event not found with id: 99"
                        )
                );

        mockMvc.perform(
                        get("/api/events/99")
                )
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error")
                        .value("Not Found"))
                .andExpect(jsonPath("$.message")
                        .value("Event not found with id: 99"));

        verify(eventService).getEventById(99L);
    }

    @Test
    void updateEvent_shouldReturnUpdatedEvent() throws Exception {

        CreateEventRequest request = new CreateEventRequest();

        request.setTitle("Updated Tech Conference");
        request.setDescription("Updated technology event");
        request.setLocation("Bangalore");
        request.setEventDate(
                LocalDateTime.of(2026, 12, 20, 10, 0)
        );
        request.setTotalSeats(150);
        request.setTicketPrice(
                new BigDecimal("750")
        );

        EventResponse response =
                new EventResponse(
                        1L,
                        "Updated Tech Conference",
                        "Updated technology event",
                        "Bangalore",
                        LocalDateTime.of(2026, 12, 20, 10, 0),
                        150,
                        150,
                        new BigDecimal("750")
                );

        when(
                eventService.updateEvent(
                        eq(1L),
                        any(CreateEventRequest.class)
                )
        ).thenReturn(response);

        mockMvc.perform(
                        put("/api/events/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title")
                        .value("Updated Tech Conference"))
                .andExpect(jsonPath("$.location")
                        .value("Bangalore"));

        verify(eventService).updateEvent(
                eq(1L),
                any(CreateEventRequest.class)
        );
    }

    @Test
    void deleteEvent_shouldReturnNoContent() throws Exception {

        doNothing()
                .when(eventService)
                .deleteEvent(1L);

        mockMvc.perform(
                        delete("/api/events/1")
                )
                .andExpect(status().isNoContent());

        verify(eventService).deleteEvent(1L);
    }
}