import React from "react";
import DoctorMenuBar from "./DoctorMenuBar";
import Appointments from "./Appointments";

const DoctorDashboard = () => {
  return (
    <>
      <DoctorMenuBar />
      <Appointments />
      <div>
        <h1>Doctor Dashboard</h1>
        <p>Welcome, Doctor! You can edit and manage content.</p>
      </div>
    </>
  );
};

export default DoctorDashboard;
