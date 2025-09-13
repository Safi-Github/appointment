package com.example.test.repository;

import com.example.test.entity.MyUser;
import com.example.test.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicesRepository extends JpaRepository<Services, Long> {

    // List<Services> findByDoctors_Id(Long doctorId);
}