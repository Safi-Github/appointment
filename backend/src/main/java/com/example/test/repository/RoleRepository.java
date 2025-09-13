package com.example.test.repository;

import com.example.test.entity.Role;
import com.example.test.enums.RoleEnum;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    // Find a Role entity by its enum name
    Optional<Role> findByName(RoleEnum name);
} 
