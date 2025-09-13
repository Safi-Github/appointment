package com.example.test.repository;

import com.example.test.entity.MyUser;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MyUserRepository extends JpaRepository<MyUser, Long> {

    @EntityGraph(attributePaths = { "roles" })
    Optional<MyUser> findByUsername(String username);

    Optional<MyUser> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    // ✅ Get all doctors belonging to a specific service
    List<MyUser> findByService_Id(Long serviceId);
}