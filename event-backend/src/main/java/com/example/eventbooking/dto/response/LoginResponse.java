package com.example.eventbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private Long userId;

    private String email;

    private String token;
}