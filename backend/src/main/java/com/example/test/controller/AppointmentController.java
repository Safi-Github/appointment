package com.example.test.controller;

import com.example.test.dto.AppointmentRequestDTO;
import com.example.test.dto.AppointmentRequestDTOForDoctor;
import com.example.test.dto.AppointmentStatusResponseDTO;
import com.example.test.entity.Appointment;
import com.example.test.entity.MyUser;
import com.example.test.entity.Services;
import com.example.test.repository.AppointmentRepository;
import com.example.test.repository.MyUserRepository;
import com.example.test.repository.ServicesRepository;
import com.example.test.service.AppointmentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AppointmentRepository appointmentRepository;
    private final MyUserRepository userRepository;
    private final ServicesRepository servicesRepository;

    // Create appointment using request body
    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequestDTO request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            MyUser patient = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

            MyUser doctor = userRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            Services service = servicesRepository.findById(request.getServiceId())
                    .orElseThrow(() -> new RuntimeException("Service not found"));

            Appointment appointment = appointmentService.createAppointment(
                    patient,
                    doctor,
                    service,
                    request.getSelectedTime()
            );


            return ResponseEntity.status(HttpStatus.CREATED).body(appointment);

        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process selectedTime JSON: " + e.getMessage());
        }
    }

    // ✅ Update appointment status
    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentStatusResponseDTO> updateAppointmentStatus(
        @PathVariable Long id,
        @RequestParam("status") String status) {

    try {
        AppointmentStatusResponseDTO responseDTO = appointmentService.updateAppointmentStatus(id, status);
            return ResponseEntity.ok(responseDTO);
    } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get patient's appointments
    @GetMapping("/patient/{id}")
    public List<Appointment> getPatientAppointments(@PathVariable Long id) {
        MyUser patient = userRepository.findById(id).orElseThrow();
        return appointmentService.getAppointmentsByPatient(patient);
    }

    // Get patient's appointmets by logged in patient token
    @GetMapping("/patient")
    public List<Appointment> getLoggedInPatientAppointments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        MyUser loggedInPatient = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found."));

        return appointmentService.getAppointmentsByPatient(loggedInPatient);
    }

    //Ge Doctor appointments by logged in doctor token
    @GetMapping("/doctor")
    public List<AppointmentRequestDTOForDoctor> getDoctorAppointments(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "patientEmail", required = false) String patientEmail) {
    
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
    
        MyUser loggedInDoctor = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    
        return appointmentService.getAppointmentsByDoctor(loggedInDoctor, status, patientEmail);
    }
    

    @GetMapping
    public List<AppointmentRequestDTOForDoctor> getAllAppointments(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String patientEmail) {
        return appointmentService.getAllAppointments(status, patientEmail);
    }
}

