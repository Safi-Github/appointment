import React, { forwardRef } from "react";

const AppointmentBill = forwardRef(({ appointment, patient }, ref) => {
  return (
    <div ref={ref} style={{ padding: "20px", border: "1px solid #ccc" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Appointment Bill
      </h2>

      <h3>Patient Information</h3>
      <p>
        Name: {patient.firstname} {patient.lastname} <br />
        Email: {patient.email}
      </p>

      <h3>Appointment Information</h3>
      <p>
        Service: {appointment.serviceName} <br />
        Doctor: {appointment.doctorFullName} <br />
        Time:{" "}
        {Object.entries(appointment.selectedTime).map(
          ([day, hours]) => `${day}: ${hours} `
        )}
      </p>
    </div>
  );
});

export default AppointmentBill;
