package com.example.test.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.test.enums.AppointmentStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Patient who booked the appointment
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private MyUser customer;

    // Service booked
    @ManyToOne
    @JoinColumn(name = "service_id")
    @JsonManagedReference
    private Services service;

    // Doctor for the appointment
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private MyUser doctor;

    private String selectedAppointmentTime; // JSON string {"Monday":"09:00-17:00"}

    private LocalDate createdDate;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status; // e.g., "BOOKED", "CANCELLED", "DONE"
}
