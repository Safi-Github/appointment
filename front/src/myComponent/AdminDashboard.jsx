import React from "react";
import MenuBarNew from "./MenuBarNew";
import MyCard from "./MyCard";
import Appointments from "./Appointments";
const AdminDashboard = () => {
  return (
    <>
      <MenuBarNew />
      <Appointments />
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome, Admin! You can manage all users and settings.</p>
      </div>
    </>
  );
};

export default AdminDashboard;
