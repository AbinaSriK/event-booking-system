package com.example.eventbooking.repository;

import com.example.eventbooking.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByUserId(Long userId, Pageable pageable);

    boolean existsByUserId(Long userId);
}