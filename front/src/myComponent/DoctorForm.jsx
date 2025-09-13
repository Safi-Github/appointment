// File: src/components/DoctorForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

export default function DoctorForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // doctor id for editing

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    specialty: "",
    phone: "",
    workingHours: {}, // use object instead of string
  });

  const [loading, setLoading] = useState(false);

  // Load existing doctor data if editing
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (id) {
      axios
        .get(`http://localhost:8080/api/user/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        .then((res) => {
          const data = res.data;
          setFormData({
            firstname: data.firstname || "",
            lastname: data.lastname || "",
            email: data.email || "",
            username: data.username || "",
            password: "", // leave empty
            specialty: data.specialty || "",
            phone: data.phone || "",
            workingHours: data.workingHours
              ? JSON.parse(data.workingHours)
              : {},
          });
        })
        .catch((err) => {
          console.error("Failed to load doctor:", err);
          alert("Failed to load doctor data.");
        });
    }
  }, [id]);

  const handleChange = (field, value) => {
    if (field === "workingHours") {
      // Parse JSON if user types manually
      try {
        setFormData({
          ...formData,
          workingHours: JSON.parse(value),
        });
      } catch (err) {
        setFormData({ ...formData, workingHours: value });
      }
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure workingHours is an object
      let workingHoursObj = {};
      if (formData.workingHours) {
        if (typeof formData.workingHours === "object") {
          workingHoursObj = formData.workingHours;
        } else {
          try {
            workingHoursObj = JSON.parse(formData.workingHours);
          } catch (err) {
            alert("Working Hours must be valid JSON!");
            setLoading(false);
            return;
          }
        }
      }

      // Build payload dynamically
      const payload = {};
      if (formData.firstname) payload.firstname = formData.firstname;
      if (formData.lastname) payload.lastname = formData.lastname;
      if (formData.email) payload.email = formData.email;
      if (formData.username) payload.username = formData.username;
      if (formData.specialty) payload.specialty = formData.specialty;
      if (formData.phone) payload.phone = formData.phone;
      if (Object.keys(workingHoursObj).length > 0)
        payload.workingHours = workingHoursObj;

      payload.roles = ["ROLE_DOCTOR"];
      payload.isActive = true;

      const token = localStorage.getItem("token");

      if (id) {
        // Editing existing doctor: PATCH only updates fields sent in payload
        await axios.patch(`http://localhost:8080/api/user/${id}`, payload, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        alert("Doctor updated successfully!");
      } else {
        // Adding new doctor: POST includes password
        if (!formData.password) {
          alert("Password is required for new doctor");
          setLoading(false);
          return;
        }
        payload.password = formData.password;
        await axios.post("http://localhost:8080/api/register", payload);
        alert("Doctor added successfully!");
      }

      navigate("/doctors");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data
          ? `Failed: ${JSON.stringify(err.response.data)}`
          : "Failed to save doctor."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "3rem 20rem" }}>
      <Card title={id ? "Edit Doctor" : "Add Doctor"} className="p-4">
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="p-field">
            <label>First Name</label>
            <InputText
              value={formData.firstname}
              onChange={(e) => handleChange("firstname", e.target.value)}
              required
            />
          </div>

          <div className="p-field">
            <label>Last Name</label>
            <InputText
              value={formData.lastname}
              onChange={(e) => handleChange("lastname", e.target.value)}
              required
            />
          </div>

          <div className="p-field">
            <label>Email</label>
            <InputText
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          <div className="p-field">
            <label>Username</label>
            <InputText
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              required
            />
          </div>

          {!id && (
            <div className="p-field">
              <label>Password</label>
              <InputText
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
            </div>
          )}

          <div className="p-field">
            <label>Specialty</label>
            <InputText
              value={formData.specialty}
              onChange={(e) => handleChange("specialty", e.target.value)}
            />
          </div>

          <div className="p-field">
            <label>Phone</label>
            <InputText
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div className="p-field">
            <label>Working Hours (JSON format)</label>
            <InputTextarea
              value={
                typeof formData.workingHours === "object"
                  ? JSON.stringify(formData.workingHours, null, 2)
                  : formData.workingHours
              }
              onChange={(e) => handleChange("workingHours", e.target.value)}
              placeholder={`e.g., {"Monday":"09:00-17:00","Tuesday":"10:00-18:00"}`}
              rows={5}
            />
          </div>

          <Button
            label={loading ? "Saving..." : id ? "Update Doctor" : "Add Doctor"}
            icon="pi pi-save"
            type="submit"
            disabled={loading}
          />
        </form>
      </Card>
    </div>
  );
}
