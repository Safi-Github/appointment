package com.example.test.repository;

import com.example.test.entity.Appointment;
import com.example.test.entity.MyUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByCustomer(MyUser customer);

    List<Appointment> findByDoctor(MyUser doctor);

    
}
