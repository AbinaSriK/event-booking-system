package com.example.eventbooking.repository;

import com.example.eventbooking.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findAll(Pageable pageable);

    Page<Event> findByTitleContainingIgnoreCase(
            String title,
            Pageable pageable);

    Page<Event> findByLocationContainingIgnoreCase(
            String location,
            Pageable pageable);

    Page<Event> findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(
            String title,
            String location,
            Pageable pageable);

}
