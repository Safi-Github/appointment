import React from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";

const MenuBarNew = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const items = [
    {
      label: "Users",
      icon: "pi pi-fw pi-users",
      command: () => navigate("/users"),
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
    {
      label: "Projects",
      icon: "pi pi-search",
      items: [
        { label: "Secure File Uploading", icon: "pi pi-bolt" },
        {
          label: "Secure File Uploading",
          icon: "pi pi-bolt",
        },
        { label: "Search Criteria", icon: "pi pi-server" },
        { label: "Search Match", icon: "pi pi-pencil" },
        { label: "Pagination", icon: "pi pi-pencil" },
        {
          label: "QR Generation/Scan",
          icon: "pi pi-pencil",
          // command: () => navigate("/senario"),
        },
        {
          label: "Templates",
          icon: "pi pi-palette",
          items: [
            { label: "Apollo", icon: "pi pi-palette" },
            { label: "Ultima", icon: "pi pi-palette" },
          ],
        },
      ],
    },
    {
      label: "Doctors",
      icon: "pi pi-fw pi-users",
      command: () => navigate("/doctors"),
    },
    {
      label: "Services",
      icon: "pi pi-fw pi-users",
      command: () => navigate("/services"),
    },
  ].filter(Boolean); // remove false values

  return (
    <div className="card">
      <Menubar model={items} />
    </div>
  );
};

export default MenuBarNew;
