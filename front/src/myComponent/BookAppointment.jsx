import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import AppointmentBill from "./AppointmentBill";
import { Button } from "primereact/button";
import { useReactToPrint } from "react-to-print";

const BookAppointment = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [billData, setBillData] = useState(null);

  const token = localStorage.getItem("token");
  const toast = useRef(null);
  const printRef = useRef();

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Appointment Bill",
  });

  // Fetch services
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  // Fetch doctors for selected service
  useEffect(() => {
    if (!selectedService) return;
    axios
      .get(`http://localhost:8080/api/services/${selectedService.id}/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error(err));
  }, [selectedService, token]);

  // Parse doctor's working hours
  useEffect(() => {
    if (!selectedDoctor) return;
    try {
      const times = JSON.parse(selectedDoctor.wrokingHours || "{}");
      const options = Object.entries(times).map(([day, hours]) => ({
        label: `${day}: ${hours}`,
        value: { [day]: hours },
      }));
      setAvailableTimes(options);
    } catch (err) {
      console.error("Error parsing working hours:", err);
      setAvailableTimes([]);
    }
  }, [selectedDoctor]);

  // Submit appointment
  const handleSubmit = async () => {
    if (!selectedService || !selectedDoctor || !selectedTime) {
      toast.current.show({
        severity: "warn",
        summary: "Incomplete Selection",
        detail: "Please select service, doctor, and time.",
        life: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/appointments",
        {
          serviceId: selectedService.id,
          doctorId: selectedDoctor.id,
          selectedTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBillData({
        appointment: {
          serviceName: selectedService.name,
          doctorFullName: `${selectedDoctor.firstname} ${selectedDoctor.lastname}`,
          selectedTime,
        },
        patient: {
          firstname: res.data.customer.firstname,
          lastname: res.data.customer.lastname,
          email: res.data.customer.email,
        },
      });

      toast.current.show({
        severity: "success",
        summary: "Appointment Booked",
        detail: "Your appointment has been booked successfully!",
        life: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Booking Failed",
        detail: "Failed to book appointment. Please try again.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Toast ref={toast} />

      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>
        Book Medical Appointment
      </h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#3498db" }}>
          Appointment Details
        </h2>

        {/* Service Selection */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Service
          </label>
          <select
            value={selectedService?.id || ""}
            onChange={(e) => {
              const service = services.find(
                (s) => s.id === parseInt(e.target.value)
              );
              setSelectedService(service || null);
              setSelectedDoctor(null);
              setSelectedTime(null);
              setAvailableTimes([]);
            }}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor Selection */}
        {selectedService && (
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Doctor
            </label>
            <select
              value={selectedDoctor?.id || ""}
              onChange={(e) => {
                const doctor = doctors.find(
                  (d) => d.id === parseInt(e.target.value)
                );
                setSelectedDoctor(doctor || null);
                setSelectedTime(null);
              }}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.firstname} {doctor.lastname}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Available Times */}
        {selectedDoctor && availableTimes.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Available Times
            </label>
            <select
              value={JSON.stringify(selectedTime) || ""}
              onChange={(e) => setSelectedTime(JSON.parse(e.target.value))}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            >
              <option value="">Select a time</option>
              {availableTimes.map((time, index) => (
                <option key={index} value={JSON.stringify(time.value)}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#95a5a6" : "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </div>

      {/* Hidden print wrapper */}
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          {billData && (
            <AppointmentBill
              appointment={billData.appointment}
              patient={billData.patient}
            />
          )}
        </div>
      </div>

      {/* Visible bill display and print button */}
      {billData && (
        <div style={{ marginTop: "20px" }}>
          <AppointmentBill
            appointment={billData.appointment}
            patient={billData.patient}
          />
          <Button
            label="Print"
            onClick={handlePrint}
            style={{ marginTop: "10px", backgroundColor: "#27ae60" }}
          />
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
