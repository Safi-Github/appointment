import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/appointments/patient",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Appointments:", response.data);
        setAppointments(response.data);
      } catch (error) {
        console.error("❌ Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const parseTime = (appointmentTime) => {
    if (!appointmentTime) return "-";
    try {
      const timeObj = JSON.parse(appointmentTime);
      return Object.entries(timeObj)
        .map(([day, time]) => `${day}: ${time}`)
        .join(", ");
    } catch {
      return appointmentTime;
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "BOOKED":
        return "info";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "warning";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <ProgressSpinner />
      </div>
    );
  }

  if (appointments.length === 0) {
    return <p className="text-center text-gray-500">No appointments found.</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2rem",
        justifyContent: "center",
        marginTop: "2rem",
      }}
    >
      {appointments.map((appt) => (
        <Card
          key={appt.id}
          title={appt.service?.name || "Service"}
          subTitle={`Dr. ${appt.doctor?.firstname || ""} ${
            appt.doctor?.lastname || ""
          }`}
          className="shadow-lg rounded-2xl border border-gray-200 p-4 w-80"
        >
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-semibold">Time: </span>
              {parseTime(appt.selectedAppointmentTime)}
            </div>
            {/* <div>
              <span className="font-semibold">Booked Date: </span>
              {appt.createdDate}
            </div> */}
            <div>
              <span className="font-semibold">Status: </span>
              <Tag value={appt.status} severity={statusColor(appt.status)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PatientAppointments;
