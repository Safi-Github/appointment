package com.example.test.entity;

import java.util.Set;

import com.example.test.enums.RoleEnum;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @Column(nullable = false, unique = true)
    // private String name; 
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private RoleEnum name; // use enum instead of String

    // @ManyToMany(mappedBy = "roles")
    // @JsonIgnore
    // private Set<MyUser> users;

}
