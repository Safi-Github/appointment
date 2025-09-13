package com.example.test.service;

import com.example.test.entity.Services;
import com.example.test.dto.ServicesResponseDTO;
import com.example.test.entity.MyUser;
import com.example.test.repository.ServicesRepository;
import com.example.test.repository.MyUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ServicesService {

    private final ServicesRepository servicesRepository;
    private final MyUserRepository userRepository;

    public ServicesService(ServicesRepository servicesRepository, MyUserRepository userRepository) {
        this.servicesRepository = servicesRepository;
        this.userRepository = userRepository;
    }

    public Services getServiceById(Long id) {
        return servicesRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found with id: " + id));
    }

    public Services createService(Services service, List<Long> doctorIds) {
        // First, save the service
    Services savedService = servicesRepository.save(service);

    // Then assign this service to each doctor
    if (doctorIds != null && !doctorIds.isEmpty()) {
        List<MyUser> doctors = userRepository.findAllById(doctorIds);

        if (doctors.size() != doctorIds.size()) {
            throw new IllegalArgumentException("One or more doctors not found");
        }

        for (MyUser doctor : doctors) {
            doctor.setService(savedService);
        }

        userRepository.saveAll(doctors);
    }

    return savedService;
    }

    public Services updateService(Long id, List<Long> doctorIds, Services updatedService) {
        // Fetch the existing service
        Services existingService = getServiceById(id);
    
        // Update basic fields
        existingService.setName(updatedService.getName());
        existingService.setDescription(updatedService.getDescription());
        existingService.setDurationMinutes(updatedService.getDurationMinutes());
        existingService.setPrice(updatedService.getPrice());
    
        // Assign the service to doctors
        if (doctorIds != null) {
            // Fetch doctors by IDs
            List<MyUser> doctors = userRepository.findAllById(doctorIds);
    
            if (doctors.size() != doctorIds.size()) {
                throw new IllegalArgumentException("One or more doctors not found");
            }
    
            // First, remove this service from any doctor no longer assigned
            List<MyUser> currentDoctors = userRepository.findByService_Id(id);
            for (MyUser doctor : currentDoctors) {
                if (!doctorIds.contains(doctor.getId())) {
                    doctor.setService(null);
                }
            }
    
            // Assign service to selected doctors
            for (MyUser doctor : doctors) {
                doctor.setService(existingService);
            }
    
            userRepository.saveAll(doctors);
            userRepository.saveAll(currentDoctors); // Save removed doctors
        }
    
        return servicesRepository.save(existingService);
    }
    
    

    public void deleteService(Long id) {
        Services service = getServiceById(id);
        servicesRepository.delete(service);
    }
}
