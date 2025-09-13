package com.example.test.dto;

import com.example.test.enums.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class AppointmentRequestDTOForDoctor {
    private Long id;
    private AppointmentStatus status;
    private String doctorFullName;
    private String serviceName;
    private String appointmentTime; 
    private LocalDate createdDate;
    private String patientFirstname;
    private String patientLastname;
    private String patientEmail;
}

