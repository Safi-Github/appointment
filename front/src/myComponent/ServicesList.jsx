// File: src/components/ServiceList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [doctorsMap, setDoctorsMap] = useState({}); // cache: serviceId → doctors
  const [selectedService, setSelectedService] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:8080/api/services", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
      alert("Failed to fetch services.");
    }
  };

  const fetchDoctors = async (serviceId) => {
    if (doctorsMap[serviceId]) return; // already cached

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:8080/api/services/${serviceId}/doctors`,
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );
      setDoctorsMap((prev) => ({ ...prev, [serviceId]: data }));
    } catch (err) {
      console.error(`Error fetching doctors for service ${serviceId}:`, err);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/services/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setServices((prev) => prev.filter((s) => s.id !== id));
      setDoctorsMap((prev) => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Failed to delete service.");
    }
  };

  const showService = async (service) => {
    await fetchDoctors(service.id);
    setSelectedService(service);
    setDialogVisible(true);
  };

  const renderDoctorsList = (service) => {
    const doctors = doctorsMap[service.id] || [];
    if (!doctors.length) return "N/A";

    return (
      <ul style={{ paddingLeft: "1rem", margin: 0 }}>
        {doctors.map((doc) => (
          <li key={doc.id}>
            <strong>
              {doc.firstname} {doc.lastname}
            </strong>{" "}
            | {doc.email} | {doc.specialty} | {doc.phone}
          </li>
        ))}
      </ul>
    );
  };

  const renderActions = (row) => (
    <div className="flex gap-2">
      <Button
        label="View"
        icon="pi pi-eye"
        className="p-button-info p-button-sm"
        onClick={() => showService(row)}
      />
      <Button
        label="Edit"
        icon="pi pi-pencil"
        className="p-button-warning p-button-sm"
        onClick={() => navigate(`/services-edit/${row.id}`)}
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => deleteService(row.id)}
      />
    </div>
  );

  const header = (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h3>Services</h3>
      <Button
        label="Add Service"
        icon="pi pi-plus"
        className="p-button-success p-button-sm"
        onClick={() => navigate("/services-add")}
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
        <DataTable value={services} responsiveLayout="scroll">
          <Column field="id" header="ID" style={{ width: "80px" }} />
          <Column field="name" header="Name" />
          <Column field="description" header="Description" />
          <Column field="durationMinutes" header="Duration (min)" />
          <Column
            field="price"
            header="Price"
            body={(row) => `$${row.price}`}
          />
          <Column
            field="doctors"
            header="Doctors"
            body={(row) =>
              doctorsMap[row.id]
                ?.map((d) => d.firstname + " " + d.lastname)
                .join(", ") || "N/A"
            }
          />
          <Column header="Actions" body={renderActions} />
        </DataTable>
      </Card>

      {/* Dialog for viewing service */}
      <Dialog
        header={selectedService?.name || "Service Details"}
        visible={dialogVisible}
        style={{ width: "500px" }}
        onHide={() => setDialogVisible(false)}
      >
        {selectedService && (
          <div>
            <p>
              <strong>Description:</strong> {selectedService.description}
            </p>
            <p>
              <strong>Duration:</strong> {selectedService.durationMinutes} min
            </p>
            <p>
              <strong>Price:</strong> ${selectedService.price}
            </p>
            <p>
              <strong>Doctors:</strong>
            </p>
            {renderDoctorsList(selectedService)}
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default ServiceList;
