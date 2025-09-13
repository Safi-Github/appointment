import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/user/loggedInUserInfo",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ProgressSpinner />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-red-500">⚠️ User not found.</p>;
  }

  return (
    <div
      style={{ marginLeft: "20rem", marginRight: "20rem", marginTop: "3rem" }}
    >
      <Card
        className="shadow-2xl rounded-2xl border border-gray-200 w-full sm:w-96 p-6"
        title="👤 Profile"
      >
        <div className="flex flex-col items-center gap-4">
          <Avatar
            label={user.firstname?.[0]}
            size="xlarge"
            shape="circle"
            className="bg-blue-500 text-white"
          />
          <h2 className="text-xl font-bold text-gray-800">{`${user.firstname} ${user.lastname}`}</h2>
          <Tag value="Active" severity="success" className="mb-3" />
        </div>

        <Divider />

        <div className="flex flex-col gap-3 text-gray-700">
          <div>
            <span className="font-semibold">📧 Email: </span>
            {user.email}
          </div>
          <div>
            <span className="font-semibold">📱 Phone: </span>
            {user.phone || "-"}
          </div>
          <div>
            <span className="font-semibold">👤 Username: </span>
            {user.username || "-"}
          </div>
          <div>
            <span className="font-semibold">🛡️ Roles: </span>
            {user.roles?.map((role, i) => (
              <Tag key={i} value={role} severity="info" className="mr-2 mb-1" />
            )) || "-"}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
