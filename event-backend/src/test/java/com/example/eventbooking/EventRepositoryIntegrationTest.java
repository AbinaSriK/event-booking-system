package com.example.eventbooking;

import com.example.eventbooking.model.Event;
import com.example.eventbooking.repository.EventRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
class EventRepositoryIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16");

    @Autowired
    private EventRepository eventRepository;

    @BeforeAll
    static void setTimezone() {
        java.util.TimeZone.setDefault(
                java.util.TimeZone.getTimeZone("UTC")
        );
    }

    @BeforeEach
    void cleanDatabase() {
        eventRepository.deleteAll();
    }

    private Event createEvent(
            String title,
            String location,
            int totalSeats
    ) {
        Event event = new Event();

        event.setTitle(title);
        event.setDescription("Technology event");
        event.setLocation(location);
        event.setEventDate(
                LocalDateTime.of(2026, 12, 10, 10, 0)
        );
        event.setTotalSeats(totalSeats);
        event.setAvailableSeats(totalSeats);
        event.setTicketPrice(BigDecimal.valueOf(500));

        return event;
    }

    @Test
    void shouldSaveAndRetrieveEvent() {

        Event event = createEvent(
                "Spring Boot Conference",
                "Chennai",
                100
        );

        Event savedEvent = eventRepository.save(event);

        assertNotNull(savedEvent.getId());

        Event foundEvent =
                eventRepository.findById(savedEvent.getId())
                        .orElseThrow();

        assertEquals(
                "Spring Boot Conference",
                foundEvent.getTitle()
        );

        assertEquals(
                "Chennai",
                foundEvent.getLocation()
        );

        assertEquals(
                100,
                foundEvent.getTotalSeats()
        );
    }

    @Test
    void shouldFindEventsByTitle() {

        eventRepository.save(
                createEvent(
                        "Spring Boot Conference",
                        "Chennai",
                        100
                )
        );

        eventRepository.save(
                createEvent(
                        "Java Developer Meetup",
                        "Bangalore",
                        50
                )
        );

        var results =
                eventRepository.findByTitleContainingIgnoreCase(
                        "spring",
                        org.springframework.data.domain.PageRequest.of(0, 10)
                );

        assertEquals(1, results.getTotalElements());

        assertEquals(
                "Spring Boot Conference",
                results.getContent().get(0).getTitle()
        );
    }

    @Test
    void shouldFindEventsByLocation() {

        eventRepository.save(
                createEvent(
                        "Spring Boot Conference",
                        "Chennai",
                        100
                )
        );

        eventRepository.save(
                createEvent(
                        "Java Developer Meetup",
                        "Bangalore",
                        50
                )
        );

        var results =
                eventRepository.findByLocationContainingIgnoreCase(
                        "chennai",
                        org.springframework.data.domain.PageRequest.of(0, 10)
                );

        assertEquals(1, results.getTotalElements());

        assertEquals(
                "Chennai",
                results.getContent().get(0).getLocation()
        );
    }

    @Test
    void shouldFindEventsByTitleAndLocation() {

        eventRepository.save(
                createEvent(
                        "Spring Boot Conference",
                        "Chennai",
                        100
                )
        );

        eventRepository.save(
                createEvent(
                        "Spring Boot Meetup",
                        "Bangalore",
                        50
                )
        );

        eventRepository.save(
                createEvent(
                        "Java Conference",
                        "Chennai",
                        75
                )
        );

        var results =
                eventRepository
                        .findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(
                                "spring",
                                "chennai",
                                org.springframework.data.domain.PageRequest.of(0, 10)
                        );

        assertEquals(1, results.getTotalElements());

        Event result = results.getContent().get(0);

        assertEquals(
                "Spring Boot Conference",
                result.getTitle()
        );

        assertEquals(
                "Chennai",
                result.getLocation()
        );
    }

    @Test
    void shouldReturnEmptyPageWhenTitleDoesNotExist() {

        eventRepository.save(
                createEvent(
                        "Spring Boot Conference",
                        "Chennai",
                        100
                )
        );

        var results =
                eventRepository.findByTitleContainingIgnoreCase(
                        "Python",
                        org.springframework.data.domain.PageRequest.of(0, 10)
                );

        assertEquals(0, results.getTotalElements());
        assertTrue(results.getContent().isEmpty());
    }

    @Test
    void shouldReturnEmptyPageWhenLocationDoesNotExist() {

        eventRepository.save(
                createEvent(
                        "Spring Boot Conference",
                        "Chennai",
                        100
                )
        );

        var results =
                eventRepository.findByLocationContainingIgnoreCase(
                        "Mumbai",
                        org.springframework.data.domain.PageRequest.of(0, 10)
                );

        assertEquals(0, results.getTotalElements());
        assertTrue(results.getContent().isEmpty());
    }

    @Test
    void shouldFindAllEventsWithPagination() {

        eventRepository.save(
                createEvent("Event 1", "Chennai", 100)
        );

        eventRepository.save(
                createEvent("Event 2", "Bangalore", 50)
        );

        eventRepository.save(
                createEvent("Event 3", "Mumbai", 75)
        );

        var results =
                eventRepository.findAll(
                        org.springframework.data.domain.PageRequest.of(0, 2)
                );

        assertEquals(3, results.getTotalElements());

        assertEquals(2, results.getContent().size());
    }
}