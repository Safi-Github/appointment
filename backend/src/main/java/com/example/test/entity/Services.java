package com.example.test.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "service")
public class Services {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g., dental checkup
    private String description;
    private int durationMinutes; // duration of service in minutes
    private double price;

    // @ManyToOne
    // @JoinColumn(name = "doctor_id")
    // private MyUser doctor;

    // ✅ One service -> many doctors
    // @OneToMany
    // @JoinColumn(name = "service_id") // FK stored in MyUser table
    // private Set<MyUser> doctors = new HashSet<>();

    // getters & setters
}
