package com.example.test.controller;

import com.example.test.entity.MyUser;
import com.example.test.entity.Role;
import com.example.test.enums.RoleEnum;
import com.example.test.repository.MyUserRepository;
import com.example.test.repository.RoleRepository;
import com.example.test.service.UserService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final MyUserRepository userRepository;
    private final RoleRepository roleRepository;

    @GetMapping("/all")
    public ResponseEntity<List<MyUser>> getAllUsers() {
        List<MyUser> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patchUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates
    ) {
        try {
            MyUser updatedUser = userService.patchUser(id, updates);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update user: " + e.getMessage());
        }
    }
    

    //change password 
    @PatchMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            MyUser user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("User not found."));

            userService.changePassword(user, request.getOldPassword(), request.getNewPassword());

            return ResponseEntity.ok("Password changed successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Data
    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;
    }

    //delete user by id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
    return userRepository.findById(id)
            .map(user -> {
                userRepository.delete(user);
                return ResponseEntity.ok("User deleted successfully");
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }

// Get logged in user info
@GetMapping("/loggedInUserInfo")
public ResponseEntity<UserResponse> getLoggedInUserInfo() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String username = auth.getName();

    MyUser user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found."));

    // Map roles to their names (String)
    Set<String> roleNames = user.getRoles().stream()
            .map(Role::getName) // if getName() returns enum, use .name() to convert to String
            .map(Object::toString)
            .collect(Collectors.toSet());

    // Build response without exposing the password
    UserResponse response = new UserResponse(
            user.getId(),
            user.getFirstname(),
            user.getLastname(),
            user.getEmail(),
            user.getUsername(),
            user.getIsActive(),
            roleNames,           // only role names
            user.getSpecialty(),
            user.getPhone(),
            user.getWorkingHours()
    );

    return ResponseEntity.ok(response);
}





    // DTO class to exclude password
    @Data
    @AllArgsConstructor
    static class UserResponse {
        private Long id;
        private String firstname;
        private String lastname;
        private String email;
        private String username;
        private Boolean isActive;
        private Set<String> roles;
        // Doctor-specific fields
        private String specialty;
        private String phone;
        private String workingHours;
    }

    @GetMapping("/{id}")
public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
    return userRepository.findById(id)
            .map(user -> {
                // Map roles to their names (String)
                Set<String> roleNames = user.getRoles().stream()
                        .map(Role::getName) // if getName() returns enum, use .name() to convert to String
                        .map(Object::toString)
                        .collect(Collectors.toSet());

                UserResponse response = new UserResponse(
                        user.getId(),
                        user.getFirstname(),
                        user.getLastname(),
                        user.getEmail(),
                        user.getUsername(),
                        user.getIsActive(),
                        roleNames,         // only role names
                        user.getSpecialty(),
                        user.getPhone(),
                        user.getWorkingHours()
                );
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
}




    // Get all roles from RoleEnum
    @GetMapping("/roleEnum")
    public ResponseEntity<List<Map<String, String>>> getAllRoles() {
    List<Map<String, String>> roles = 
        Arrays.stream(RoleEnum.values())
              .map(role -> Map.of(
                  "name", role.name()
              ))
              .toList();

        return ResponseEntity.ok(roles);
    }
}
