package com.example.test.controller;

import com.example.test.entity.Role;
import com.example.test.enums.RoleEnum;
import com.example.test.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleRepository roleRepository;

    // ---- Service methods inside the same file ----
    private List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    private Optional<Role> getRoleById(Long id) {
        return roleRepository.findById(id);
    }

    private Role createRole(Role role) {
        return roleRepository.save(role);
    }

    private Role updateRole(Long id, Role updatedRole) {
        return roleRepository.findById(id).map(role -> {
            role.setName(updatedRole.getName());
            return roleRepository.save(role);
        }).orElseThrow(() -> new RuntimeException("Role not found with id " + id));
    }

    private void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }

    // ---- Controller Endpoints ----

    @GetMapping
    public ResponseEntity<List<Role>> allRoles() {
        return ResponseEntity.ok(getAllRoles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> getRole(@PathVariable Long id) {
        return getRoleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Role> addRole(@RequestBody Role role) {
        return ResponseEntity.ok(createRole(role));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> editRole(@PathVariable Long id, @RequestBody Role role) {
        return ResponseEntity.ok(updateRole(id, role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeRole(@PathVariable Long id) {
        deleteRole(id);
        return ResponseEntity.noContent().build();
    }

    // Optional: Return enum values
    @GetMapping("/enum")
    public ResponseEntity<RoleEnum[]> roleEnums() {
        return ResponseEntity.ok(RoleEnum.values());
    }
}
