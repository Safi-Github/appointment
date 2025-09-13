import { Button } from "primereact/button";
import React from "react";
import UserMenuBarNew from "./UserMenuBar";
import PatientAppointments from "./PatientAppointments";

const Home = () => {
  return (
    <div>
      <UserMenuBarNew />
      <PatientAppointments />
      <h1>Home</h1>
      <p>Welcome to the system! Please login or register to continue.</p>
    </div>
  );
};

export default Home;
