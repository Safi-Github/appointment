// File: src/components/DoctorList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigate = useNavigate();

  // Fetch users and filter doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/user/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter only ROLE_DOCTOR users
        const doctorUsers = response.data.filter(
          (user) =>
            user.roles && user.roles.some((role) => role.name === "ROLE_DOCTOR")
        );

        setDoctors(doctorUsers);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  // Delete doctor
  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor");
    }
  };

  // Show doctor working hours in dialog
  const showWorkingHours = (doctor) => {
    setSelectedDoctor(doctor);
    setDialogVisible(true);
  };

  // Format working hours object to readable text
  const formatWorkingHours = (workingHours) => {
    if (!workingHours) return "No working hours available.";
    let hoursObj = workingHours;
    if (typeof workingHours === "string") {
      try {
        hoursObj = JSON.parse(workingHours);
      } catch {
        return "Invalid format";
      }
    }
    return Object.entries(hoursObj)
      .map(([day, hours]) => `${day}: ${hours}`)
      .join("\n");
  };

  const header = (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h3>Doctors</h3>
      <Button
        label="Add Doctor"
        icon="pi pi-plus"
        className="p-button-success p-button-sm"
        onClick={() => navigate("/doctor-add")}
      />
    </div>
  );

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
    >
      <Card
        title={header}
        className="shadow-lg w-full md:w-10 lg:w-8 xl:w-6"
        style={{ width: "70rem" }}
      >
        <DataTable value={doctors} responsiveLayout="scroll">
          <Column field="id" header="ID" style={{ width: "80px" }} />
          <Column field="firstname" header="First Name" />
          <Column field="lastname" header="Last Name" />
          <Column field="email" header="Email" />
          <Column field="username" header="Username" />
          <Column field="specialty" header="Specialty" />
          <Column field="phone" header="Phone" />
          <Column
            header="Working Hours"
            body={(rowData) =>
              rowData.workingHours &&
              Object.keys(rowData.workingHours).length > 0 ? (
                <Button
                  label="View"
                  icon="pi pi-eye"
                  className="p-button-sm p-button-info"
                  onClick={() => showWorkingHours(rowData)}
                />
              ) : (
                "N/A"
              )
            }
          />
          <Column
            header="Actions"
            body={(rowData) => (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  className="p-button-sm p-button-warning"
                  onClick={() => navigate(`/doctor-edit/${rowData.id}`)}
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  className="p-button-sm p-button-danger"
                  onClick={() => deleteDoctor(rowData.id)}
                />
              </div>
            )}
          />
        </DataTable>
      </Card>

      {/* Working Hours Dialog */}
      <Dialog
        header={
          selectedDoctor
            ? `${selectedDoctor.firstname} ${selectedDoctor.lastname} Working Hours`
            : "Working Hours"
        }
        visible={dialogVisible}
        style={{ width: "400px" }}
        onHide={() => setDialogVisible(false)}
      >
        <pre>
          {selectedDoctor && formatWorkingHours(selectedDoctor.workingHours)}
        </pre>
      </Dialog>
    </div>
  );
};

export default DoctorList;
