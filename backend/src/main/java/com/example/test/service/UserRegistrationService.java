package com.example.test.service;

import com.example.test.entity.MyUser;
import com.example.test.entity.Role;
import com.example.test.enums.RoleEnum;
import com.example.test.repository.MyUserRepository;
import com.example.test.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserRegistrationService {

    private final MyUserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public MyUser registerUser(MyUser user) {
        // Check for existing email or username
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already in use");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Ensure at least one role
        // if (user.getRoles() == null || user.getRoles().isEmpty()) {
        //     user.setRoles(Set.of(RoleEnum.ROLE_USER));
        // }

        // Ensure at least one role
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Role defaultRole = roleRepository.findByName(RoleEnum.ROLE_USER)
                    .orElseThrow(() -> new IllegalArgumentException("Default role not found"));
            user.setRoles(Set.of(defaultRole));
        }

        // Save to database
        return userRepository.save(user);
    }
}
