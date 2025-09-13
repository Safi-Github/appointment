// package com.example.test.config;

// import jakarta.annotation.PostConstruct;
// import com.example.test.entity.Role;
// import com.example.test.enums.RoleEnum;
// import com.example.test.repository.RoleRepository;
// import org.springframework.stereotype.Component;

// import java.util.Optional;

// @Component
// public class RoleInitializer {

//     private final RoleRepository roleRepository;

//     public RoleInitializer(RoleRepository roleRepository) {
//         this.roleRepository = roleRepository;
//     }

//     @PostConstruct
//     public void init() {
//         // Create default ROLE_USER if not exists
//         createDefaultRole(RoleEnum.ROLE_USER);
//         createDefaultRole(RoleEnum.ROLE_DOCTOR);
//         createDefaultRole(RoleEnum.ROLE_ADMIN);
//     }

//     private void createDefaultRole(RoleEnum roleEnum) {
//         Optional<Role> existingRole = roleRepository.findByName(roleEnum);
//         if (existingRole.isEmpty()) {
//             Role role = new Role();
//             role.setName(roleEnum);
//             roleRepository.save(role);
//             System.out.println("✅ Default role created: " + roleEnum);
//         }
//     }
// }
