import React from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";

const UserMenuBarNew = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const items = [
    {
      label: "Book Appointment",
      icon: "pi pi-fw pi-users",
      command: () => navigate("/book-appointment"),
    },
    {
      label: "Settings",
      icon: "pi pi-setting",
      items: [
        {
          label: "Change My Pass",
          icon: "pi pi-palette",
          command: () => navigate("/change-pass"),
        },
        {
          label: "Profile",
          icon: "pi pi-palette",
          command: () => navigate("/profile"),
        },
        { label: "Logout", icon: "pi pi-palette", command: handleLogout },
      ],
    },
  ].filter(Boolean); // remove false values

  return (
    <div className="card">
      <Menubar model={items} />
    </div>
  );
};

export default UserMenuBarNew;
