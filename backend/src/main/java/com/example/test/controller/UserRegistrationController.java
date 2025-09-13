package com.example.test.controller;

import com.example.test.entity.MyUser;
import com.example.test.entity.Role;
import com.example.test.enums.RoleEnum;
import com.example.test.repository.RoleRepository;
import com.example.test.service.UserRegistrationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserRegistrationController {

    private final UserRegistrationService userRegistrationService;
    private final RoleRepository roleRepository;
    private final ObjectMapper objectMapper = new ObjectMapper(); // for workingHours

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Validated @RequestBody Map<String, Object> requestMap) {
        try {
            MyUser user = new MyUser();
            user.setFirstname((String) requestMap.get("firstname"));
            user.setLastname((String) requestMap.get("lastname"));
            user.setEmail((String) requestMap.get("email"));
            user.setUsername((String) requestMap.get("username"));
            user.setPassword((String) requestMap.get("password"));
            user.setSpecialty((String) requestMap.get("specialty"));
            user.setPhone((String) requestMap.get("phone"));
            user.setIsActive(requestMap.get("isActive") != null ? (Boolean) requestMap.get("isActive") : true);

            // Handle roles
            Set<Role> roles = new HashSet<>();
            if (requestMap.get("roles") != null) {
                List<String> roleList = (List<String>) requestMap.get("roles");
                for (String roleName : roleList) {
                    Role role = roleRepository.findByName(RoleEnum.valueOf(roleName))
                            .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleName));
                        roles.add(role);
            }
            } else {
                // Assign default ROLE_USER
                Role defaultRole = roleRepository.findByName(RoleEnum.ROLE_USER)
                        .orElseThrow(() -> new IllegalArgumentException("Default role not found"));
                roles.add(defaultRole);
            }
            user.setRoles(roles);

            // Convert workingHours JSON object to String
            if (requestMap.get("workingHours") != null) {
                String workingHoursJson = objectMapper.writeValueAsString(requestMap.get("workingHours"));
                user.setWorkingHours(workingHoursJson);
            }

            MyUser savedUser = userRegistrationService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("User registered successfully with ID: " + savedUser.getId());

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to register user: " + e.getMessage());
        }
    }
}
