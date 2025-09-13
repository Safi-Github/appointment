import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";

export default function ChangeMyPassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "New password and confirm password do not match.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch(
        "http://localhost:8080/api/user/change-password",
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: response.data,
      });
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data || "Error changing password.";
      toast.current.show({ severity: "error", summary: "Error", detail: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ marginTop: "3rem", marginLeft: "20rem", marginRight: "20rem" }}
    >
      <Card title="Change Password" className="p-4">
        <Toast ref={toast} />

        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="p-field">
            <label>Old Password</label>
            <Password
              value={formData.oldPassword}
              onChange={(e) => handleChange("oldPassword", e.target.value)}
              feedback={false}
              toggleMask
              required
            />
          </div>

          <div className="p-field">
            <label>New Password</label>
            <Password
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              feedback={true}
              toggleMask
              required
            />
          </div>

          <div className="p-field">
            <label>Confirm New Password</label>
            <Password
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              feedback={false}
              toggleMask
              required
            />
          </div>

          <Button
            label="Change Password"
            type="submit"
            icon="pi pi-save"
            loading={loading}
          />
        </form>
      </Card>
      <div style={{ marginTop: "3rem" }}>
        <Button
          label="Back"
          icon="pi pi-arrow-left"
          severity="secondary"
          onClick={() => navigate("/admin-dashboard")}
        />
      </div>
    </div>
  );
}
