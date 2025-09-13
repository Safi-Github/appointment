import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const isAuthenticated = !!token;

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    isActive: true,
    roles: isAuthenticated ? [] : ["ROLE_USER"],
  });

  const [originalData, setOriginalData] = useState({});
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        // Fetch all available roles
        const roleRes = await axios.get("http://localhost:8080/api/roles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(roleRes.data); // should be [{ name: "ROLE_ADMIN" }, { name: "ROLE_USER" }, ...]

        // Fetch user info if editing
        if (id) {
          const userRes = await axios.get(
            `http://localhost:8080/api/user/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const user = userRes.data;

          setFormData({
            ...user,
            password: "",
            roles: user.roles || [], // roles are already strings from backend
          });

          setOriginalData({
            ...user,
            roles: user.roles || [],
          });
        }
      } catch (err) {
        console.error("Error loading form data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, isAuthenticated]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id && isAuthenticated) {
        // Prepare PATCH payload (only changed fields)
        const payload = {};
        for (let key in formData) {
          if (
            key === "roles" &&
            JSON.stringify(formData.roles) !==
              JSON.stringify(originalData.roles)
          ) {
            payload.roles = formData.roles; // Send as array of strings
          } else if (
            formData[key] !== originalData[key] &&
            key !== "password"
          ) {
            payload[key] = formData[key];
          }
        }

        if (Object.keys(payload).length === 0) {
          alert("No changes detected");
          return;
        }

        await axios.patch(`http://localhost:8080/api/user/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/users");
      } else {
        // CREATE new user
        const payload = { ...formData };
        await axios.post("http://localhost:8080/api/register", payload, {
          headers: isAuthenticated ? { Authorization: `Bearer ${token}` } : {},
        });

        navigate(isAuthenticated ? "/users" : "/");
      }
    } catch (err) {
      console.error("Error saving user:", err);
      alert(
        err.response?.data
          ? `Failed: ${JSON.stringify(err.response.data)}`
          : "Failed to save user."
      );
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      style={{ marginTop: "3rem", marginLeft: "20rem", marginRight: "20rem" }}
    >
      <Card
        title={
          !isAuthenticated
            ? "Create Your Account"
            : id
            ? "Edit User"
            : "Add User"
        }
        className="p-4"
      >
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
                required // required only when creating new user
              />
            </div>
          )}

          {isAuthenticated && (
            <>
              <div className="p-field">
                <label>Roles</label>
                <MultiSelect
                  value={formData.roles}
                  options={roles}
                  onChange={(e) => handleChange("roles", e.value)}
                  optionLabel="name"
                  optionValue="name"
                  placeholder="Select Roles"
                  display="chip"
                  className="w-full"
                />
              </div>

              <div className="p-field-checkbox">
                <Checkbox
                  checked={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.checked)}
                />
                <label>Active</label>
              </div>
            </>
          )}

          <Button
            label={
              !isAuthenticated ? "Sign Up" : id ? "Update User" : "Add User"
            }
            icon="pi pi-save"
            type="submit"
          />
        </form>
      </Card>

      {isAuthenticated && (
        <div style={{ marginTop: "2rem" }}>
          <Button
            label="Back"
            icon="pi pi-arrow-left"
            severity="secondary"
            onClick={() => navigate("/admin-dashboard")}
          />
        </div>
      )}
    </div>
  );
}
