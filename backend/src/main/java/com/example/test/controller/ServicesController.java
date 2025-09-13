package com.example.test.controller;

import com.example.test.dto.ServicesResponseDTO;
import com.example.test.entity.MyUser;
import com.example.test.entity.Services;
import com.example.test.repository.MyUserRepository;
import com.example.test.repository.ServicesRepository;
import com.example.test.service.ServicesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
public class ServicesController {

    private final ServicesService servicesService;
    private final ServicesRepository servicesRepository;
    private final MyUserRepository myUserRepository;

    public ServicesController(ServicesService servicesService, ServicesRepository servicesRepository, MyUserRepository myUserRepository) {
        this.servicesService = servicesService;
        this.servicesRepository = servicesRepository; 
        this.myUserRepository = myUserRepository;
    }

    @GetMapping
    public List<ServicesResponseDTO> getAllServices() {
        List<Services> services = servicesRepository.findAll();

        // ✅ map entities → DTOs
        return services.stream()
                .map(service -> new ServicesResponseDTO(
                        service.getId(),
                        service.getName(),
                        service.getDescription(),
                        service.getDurationMinutes(),
                        service.getPrice()
                ))
                .collect(Collectors.toList());
    }

    // Doctor DTO
    public record DoctorResponseDTO(
        Long id,
        String firstname,
        String lastname,
        String email,
        String specialty,
        String phone,
        String wrokingHours
    ) {}
    // Get all doctors of a specific service
    @GetMapping("/{serviceId}/doctors")
    public List<DoctorResponseDTO> getDoctorsByService(@PathVariable Long serviceId) {
        return myUserRepository.findByService_Id(serviceId)
            .stream()
            .map(user -> new DoctorResponseDTO(
                    user.getId(),
                    user.getFirstname(),
                    user.getLastname(),
                    user.getEmail(),
                    user.getSpecialty(),
                    user.getPhone(),
                    user.getWorkingHours()
            ))
            .collect(Collectors.toList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Services> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(servicesService.getServiceById(id));
    }

    @PostMapping
    public ResponseEntity<Services> createService(
            @RequestBody Services service,
            @RequestParam(required = false) List<Long> doctorIds) {

        Services created = servicesService.createService(service, doctorIds);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Services> updateService(
            @PathVariable Long id,
            @RequestParam(required = false) List<Long> doctorIds,
            @RequestBody Services service) {

        Services updated = servicesService.updateService(id, doctorIds, service);
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        servicesService.deleteService(id);
        return ResponseEntity.ok("Service deleted successfully");
    }

    // @GetMapping("/doctor/{doctorId}")
    // public ResponseEntity<List<Services>> getServicesByDoctor(@PathVariable Long doctorId) {
    //     return ResponseEntity.ok(servicesService.getServicesByDoctor(doctorId));
    // }
}
