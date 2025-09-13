package com.example.test.service;

import com.example.test.entity.MyUser;
import com.example.test.entity.Role;
import com.example.test.enums.RoleEnum;
import com.example.test.repository.MyUserRepository;
import com.example.test.repository.RoleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper = new ObjectMapper(); 
    private final MyUserRepository userRepository;


    //User info partial update service
    @Transactional
    public MyUser patchUser(Long id, Map<String, Object> updates) {
        Optional<MyUser> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }

        MyUser user = optionalUser.get();

        if (updates.containsKey("firstname")) {
            user.setFirstname((String) updates.get("firstname"));
        }

        if (updates.containsKey("lastname")) {
            user.setLastname((String) updates.get("lastname"));
        }

        if (updates.containsKey("email")) {
            user.setEmail((String) updates.get("email"));
        }

        if (updates.containsKey("username")) {
            user.setUsername((String) updates.get("username"));
        }

        // Prevent updating password
        if (updates.containsKey("password")) {
            throw new IllegalArgumentException("Password cannot be updated via this endpoint.");
        }

        if (updates.containsKey("isActive")) {
            user.setIsActive((Boolean) updates.get("isActive"));
        }

    // if (updates.containsKey("roles")) {
    //     @SuppressWarnings("unchecked")
    //     List<String> roleStrings = (List<String>) updates.get("roles");
    //     Set<RoleEnum> roles = roleStrings.stream()
    //             .map(RoleEnum::valueOf)
    //             .collect(Collectors.toSet());
    //     user.setRoles(roles);
    // }

    if (updates.containsKey("roles")) {
        @SuppressWarnings("unchecked")
        List<String> roleStrings = (List<String>) updates.get("roles");

        Set<Role> roles = new HashSet<>();
        for (String roleStr : roleStrings) {
            RoleEnum roleEnum = RoleEnum.valueOf(roleStr);
            Role role = roleRepository.findByName(roleEnum)
                    .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleEnum));
            roles.add(role);
        }

        user.setRoles(roles);
    }

    // Doctor-specific fields
    if (updates.containsKey("specialty")) {
        user.setSpecialty((String) updates.get("specialty"));
    }

    if (updates.containsKey("phone")) {
        user.setPhone((String) updates.get("phone"));
    }

    if (updates.containsKey("workingHours")) {
        try {
            // Convert JSON object/map to string
            String workingHoursJson = objectMapper.writeValueAsString(updates.get("workingHours"));
            user.setWorkingHours(workingHoursJson);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid workingHours format");
        }
    }

    return userRepository.save(user);
}


    //change password service
    @Transactional
    public void changePassword(MyUser user, String oldPassword, String newPassword) {
        // Verify current password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("New Password can not be the Old one");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
