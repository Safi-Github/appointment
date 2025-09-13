// File: src/components/ServiceForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";

export default function ServiceForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // service id for editing

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    durationMinutes: 0,
    price: 0,
    doctorIds: [], // now array for multi-select
  });

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load doctors and existing service if editing
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch all doctors
    axios
      .get("http://localhost:8080/api/user/all", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })
      .then((res) => {
        const doctorUsers = res.data.filter(
          (user) =>
            user.roles && user.roles.some((role) => role.name === "ROLE_DOCTOR")
        );
        setDoctors(doctorUsers);
      })
      .catch((err) => console.error("Failed to load doctors:", err));

    // If editing, fetch existing service
    if (id) {
      axios
        .get(`http://localhost:8080/api/services/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        })
        .then((res) => {
          const data = res.data;
          setFormData({
            name: data.name || "",
            description: data.description || "",
            durationMinutes: data.durationMinutes || 0,
            price: data.price || 0,
            doctorIds: data.doctor ? [data.doctor.id] : [], // wrap in array for multi-select
          });
        })
        .catch((err) => {
          console.error("Failed to load service:", err);
          alert("Failed to load service data.");
        });
    }
  }, [id]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const serializeParams = (params) => {
    // Serialize array as repeated query params
    return Object.keys(params)
      .map((key) => {
        const value = params[key];
        if (Array.isArray(value)) {
          return value.map((v) => `${key}=${v}`).join("&");
        }
        return `${key}=${value}`;
      })
      .join("&");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (id) {
        // --- EDIT MODE ---
        const url = `http://localhost:8080/api/services/${id}`;

        await axios.patch(
          url,
          {
            name: formData.name,
            description: formData.description,
            durationMinutes: formData.durationMinutes,
            price: formData.price,
          },
          {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
            params: { doctorIds: formData.doctorIds },
            paramsSerializer: serializeParams,
          }
        );

        alert("Service updated successfully!");
      } else {
        // --- ADD NEW SERVICE ---
        await axios.post(
          `http://localhost:8080/api/services`,
          {
            name: formData.name,
            description: formData.description,
            durationMinutes: formData.durationMinutes,
            price: formData.price,
          },
          {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
            params: { doctorIds: formData.doctorIds },
            paramsSerializer: serializeParams,
          }
        );
        alert("Service added successfully!");
      }

      navigate("/services"); // redirect to service list
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data
          ? `Failed: ${JSON.stringify(err.response.data)}`
          : "Failed to save service."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "3rem 20rem" }}>
      <Card title={id ? "Edit Service" : "Add Service"} className="p-4">
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="p-field">
            <label>Name</label>
            <InputText
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="p-field">
            <label>Description</label>
            <InputTextarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />
          </div>

          <div className="p-field">
            <label>Duration (minutes)</label>
            <InputNumber
              value={formData.durationMinutes}
              onValueChange={(e) => handleChange("durationMinutes", e.value)}
              min={0}
              required
            />
          </div>

          <div className="p-field">
            <label>Price</label>
            <InputNumber
              value={formData.price}
              onValueChange={(e) => handleChange("price", e.value)}
              min={0}
              mode="currency"
              currency="USD"
              locale="en-US"
              required
            />
          </div>

          <div className="p-field">
            <label>Doctors</label>
            <MultiSelect
              value={formData.doctorIds}
              options={doctors.map((d) => ({
                label: `${d.firstname} ${d.lastname}`,
                value: d.id,
              }))}
              onChange={(e) => handleChange("doctorIds", e.value)}
              placeholder="Select doctors"
              display="chip"
            />
          </div>

          <Button
            label={
              loading ? "Saving..." : id ? "Update Service" : "Add Service"
            }
            icon="pi pi-save"
            type="submit"
            disabled={loading}
          />
        </form>
      </Card>
    </div>
  );
}
