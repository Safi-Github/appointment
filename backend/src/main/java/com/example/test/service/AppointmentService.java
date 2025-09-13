package com.example.test.service;

import com.example.test.dto.AppointmentRequestDTO;
import com.example.test.dto.AppointmentRequestDTOForDoctor;
import com.example.test.dto.AppointmentStatusResponseDTO;
import com.example.test.entity.Appointment;
import com.example.test.entity.MyUser;
import com.example.test.entity.Services;
import com.example.test.enums.AppointmentStatus;
import com.example.test.repository.AppointmentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final EmailService emailService;

    public Appointment createAppointment(MyUser patient, MyUser doctor, Services service, Map<String, String> selectedTime) throws JsonProcessingException {
        Appointment appointment = new Appointment();
        appointment.setCustomer(patient);
        appointment.setDoctor(doctor);
        appointment.setService(service);

        if (selectedTime != null) {
            String appointmentTimeJson = objectMapper.writeValueAsString(selectedTime);
            appointment.setSelectedAppointmentTime(appointmentTimeJson);
        }

        appointment.setCreatedDate(LocalDate.now());
        appointment.setStatus(AppointmentStatus.BOOKED);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // ✅ Send email notification to doctor
        if (doctor != null && doctor.getEmail() != null) {
            String subject = "New Appointment Booked";
            String body = "Dear Dr. " + doctor.getFirstname() + " " + doctor.getLastname() + ",\n\n"
                    + "A new appointment has been booked by patient "
                    + patient.getFirstname() + " " + patient.getLastname() + ".\n\n"
                    + "Service: " + (service != null ? service.getName() : "N/A") + "\n"
                    + "Time: " + (selectedTime != null ? selectedTime.toString() : "N/A") + "\n"
                    + "Date: " + LocalDate.now().format(DateTimeFormatter.ISO_DATE) + "\n\n"
                    + "Please log in to your account for more details.\n\n"
                    + "Regards,\nYour Clinic";

            emailService.sendAppointmentEmail(doctor.getEmail(), subject, body);
        }

        return savedAppointment;
    }

    public AppointmentStatusResponseDTO updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        try {
            appointment.setStatus(AppointmentStatus.valueOf(status.toUpperCase())); // BOOKED, COMPLETED, CANCELLED
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value. Allowed: BOOKED, COMPLETED, CANCELLED");
        }

        Appointment saved = appointmentRepository.save(appointment);

        // ✅ Send email if COMPLETED or CANCELLED
        if (saved.getCustomer() != null && saved.getCustomer().getEmail() != null) {
            String patientEmail = saved.getCustomer().getEmail();
            String patientName = saved.getCustomer().getFirstname() + " " + saved.getCustomer().getLastname();
            String doctorName = saved.getDoctor() != null
                    ? saved.getDoctor().getFirstname() + " " + saved.getDoctor().getLastname()
                    : "Doctor";
            String serviceName = saved.getService() != null ? saved.getService().getName() : "Service";

            if (saved.getStatus() == AppointmentStatus.CANCELLED) {
                emailService.sendAppointmentEmail(
                        patientEmail,
                        "Appointment Cancelled",
                        "Dear " + patientName + ",\n\n" +
                        "Your appointment for \"" + serviceName + "\" with Dr. " + doctorName + " has been CANCELLED.\n\n" +
                        "Thank you."
                );
            } else if (saved.getStatus() == AppointmentStatus.COMPLETED) {
                emailService.sendAppointmentEmail(
                        patientEmail,
                        "Appointment Completed",
                        "Dear " + patientName + ",\n\n" +
                        "Your appointment for \"" + serviceName + "\" with Dr. " + doctorName + " has been marked as COMPLETED.\n\n" +
                        "Thank you for using our service."
                );
            }
        }

        return new AppointmentStatusResponseDTO(
                saved.getId(),
                saved.getCustomer().getFirstname() + " " + saved.getCustomer().getLastname(),
                saved.getService() != null ? saved.getService().getName() : null,
                saved.getDoctor() != null ? saved.getDoctor().getFirstname() + " " + saved.getDoctor().getLastname() : null
        );
    }


    public List<Appointment> getAppointmentsByPatient(MyUser patient) {
        return appointmentRepository.findByCustomer(patient);
    }


    public List<AppointmentRequestDTOForDoctor> getAppointmentsByDoctor(
        MyUser doctor, String status, String patientEmail) {

    List<Appointment> appointments = appointmentRepository.findByDoctor(doctor);

    return appointments.stream()
            // Filter by status if provided
            .filter(a -> status == null || a.getStatus().name().equalsIgnoreCase(status))
            // Filter by patient email if provided
            .filter(a -> patientEmail == null || 
                         (a.getCustomer() != null && a.getCustomer().getEmail().equalsIgnoreCase(patientEmail)))
            .map(a -> new AppointmentRequestDTOForDoctor(
                    a.getId(),
                    a.getStatus(),
                    doctor.getFirstname() + " " + doctor.getLastname(),
                    a.getService() != null ? a.getService().getName() : null,
                    a.getSelectedAppointmentTime(),
                    a.getCreatedDate(),
                    a.getCustomer() != null ? a.getCustomer().getFirstname() : null,
                    a.getCustomer() != null ? a.getCustomer().getLastname() : null,
                    a.getCustomer() != null ? a.getCustomer().getEmail() : null
            ))
            .toList();
    }


    public List<AppointmentRequestDTOForDoctor> getAllAppointments(String status, String patientEmail) {
    List<Appointment> appointments = appointmentRepository.findAll();

    return appointments.stream()
            // Filter by status if provided
            .filter(a -> status == null || a.getStatus().name().equalsIgnoreCase(status))
            // Filter by patient email if provided
            .filter(a -> patientEmail == null || 
                        (a.getCustomer() != null && 
                         a.getCustomer().getEmail().equalsIgnoreCase(patientEmail)))
            .map(a -> new AppointmentRequestDTOForDoctor(
                    a.getId(),
                    a.getStatus(),
                    a.getDoctor() != null ? a.getDoctor().getFirstname() + " " + a.getDoctor().getLastname() : null,
                    a.getService() != null ? a.getService().getName() : null,
                    a.getSelectedAppointmentTime(),
                    a.getCreatedDate(),
                    a.getCustomer() != null ? a.getCustomer().getFirstname() : null,
                    a.getCustomer() != null ? a.getCustomer().getLastname() : null,
                    a.getCustomer() != null ? a.getCustomer().getEmail() : null
            ))
            .toList();
}


}

