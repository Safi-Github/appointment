package com.example.test.dto;

import java.util.Map;

import lombok.Data;

@Data
public class AppointmentRequestDTO {
    private Long patientId;
    private Long doctorId;
    private Long serviceId;
    private Map<String, String> selectedTime; 
}
