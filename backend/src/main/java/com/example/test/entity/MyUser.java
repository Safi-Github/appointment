package com.example.test.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.example.test.enums.RoleEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users") // avoid reserved keyword `user`
public class MyUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String firstname;

    @NotBlank
    private String lastname;

    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank
    private String password;

    @Column(columnDefinition = "boolean default true")
    private Boolean isActive = true;

    // @ElementCollection(targetClass = RoleEnum.class, fetch = FetchType.EAGER)
    // @Enumerated(EnumType.STRING)
    // @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    // @Column(name = "role")
    // private Set<RoleEnum> roles = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    // ===== Doctor-specific fields =====
    private String specialty; // e.g., Dentist, Cardiologist
    private String phone; // optional for doctors
    private String workingHours; // JSON string {"Monday":"09:00-17:00", ...}

     // ✅ Each doctor belongs to exactly one service
     @ManyToOne
     @JoinColumn(name = "service_id")
     private Services service;

    // Appointments where this user is the **customer**
    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    private List<Appointment> appointments;
}
