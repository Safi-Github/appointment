import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/user/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("all data ", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  // Header with title and Add button
  const header = (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h3>Users</h3>
      <Button
        label="Add User"
        icon="pi pi-plus"
        className="p-button-success p-button-sm"
        onClick={() => navigate("/user-add")}
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
        <DataTable value={users} responsiveLayout="scroll">
          <Column field="id" header="ID" style={{ width: "80px" }} />
          <Column field="firstname" header="First Name" />
          <Column field="lastname" header="Last Name" />
          <Column field="email" header="Email" />
          <Column field="username" header="Username" />
          <Column
            field="isActive"
            header="Active"
            body={(rowData) => (rowData.isActive ? "Yes" : "No")}
          />
          <Column
            field="roles"
            header="Roles"
            body={(rowData) =>
              rowData.roles && rowData.roles.length > 0
                ? rowData.roles.map((role) => role.name).join(", ")
                : "No Roles"
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
                  onClick={() => navigate(`/user-edit/${rowData.id}`)}
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  className="p-button-sm p-button-danger"
                  onClick={() => deleteUser(rowData.id)}
                />
              </div>
            )}
          />
        </DataTable>
      </Card>
    </div>
  );
};

export default UserList;
