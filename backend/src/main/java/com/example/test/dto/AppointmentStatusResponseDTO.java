package com.example.test.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentStatusResponseDTO {
    private Long id;
    private String patientFullName;
    private String serviceName;
    private String doctorFullName;
}