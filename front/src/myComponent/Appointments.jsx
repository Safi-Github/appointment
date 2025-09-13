import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabView, TabPanel } from "primereact/tabview";
import axios from "axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("BOOKED");
  const [buttonLoading, setButtonLoading] = useState({});
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  // Parse appointment time
  const parseTime = (appointmentTime) => {
    if (!appointmentTime) return "-";
    try {
      const timeObj = JSON.parse(appointmentTime);
      return Object.entries(timeObj)
        .map(([day, time]) => `${day}: ${time}`)
        .join(", ");
    } catch {
      return appointmentTime;
    }
  };

  // Tag color
  const statusColor = (status) => {
    switch (status) {
      case "BOOKED":
        return "info";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "warning";
    }
  };

  // ✅ Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/user/loggedInUserInfo",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
      } catch (error) {
        console.error("❌ Error fetching user info:", error);
      }
    };
    fetchUser();
  }, [token]);

  // ✅ Fetch appointments depending on role
  const fetchAppointments = async (statusFilter) => {
    if (!user) return;

    setLoading(true);
    try {
      let url = "";

      if (user.roles?.includes("ROLE_ADMIN")) {
        url = "http://localhost:8080/api/appointments";
      } else if (user.roles?.includes("ROLE_DOCTOR")) {
        url = "http://localhost:8080/api/appointments/doctor";
      }

      if (statusFilter && statusFilter !== "ALL") {
        url += `?status=${statusFilter}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("this is the admin/doctor data ", response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update appointment status
  const updateStatus = async (appointmentId, status) => {
    const key = `${appointmentId}-${status}`;
    try {
      setButtonLoading((prev) => ({ ...prev, [key]: true }));

      await axios.put(
        `http://localhost:8080/api/appointments/${appointmentId}/status?status=${status}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status } : appt
        )
      );
    } catch (error) {
      console.error(`❌ Error updating status to ${status}:`, error);
    } finally {
      setButtonLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Refetch when role or tab changes
  useEffect(() => {
    if (user) {
      fetchAppointments(activeTab);
    }
  }, [activeTab, user]);

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <TabView
      activeIndex={["BOOKED", "COMPLETED", "CANCELLED", "ALL"].indexOf(
        activeTab
      )}
      onTabChange={(e) =>
        setActiveTab(["BOOKED", "COMPLETED", "CANCELLED", "ALL"][e.index])
      }
      style={{ marginTop: "2rem", marginLeft: "3rem", marginRight: "3rem" }}
    >
      {["BOOKED", "COMPLETED", "CANCELLED", "ALL"].map((tab) => (
        <TabPanel key={tab} header={tab}>
          {appointments.length === 0 ? (
            <p className="text-center text-gray-500">No appointments found.</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2rem",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              {appointments.map((appt) => {
                const completeKey = `${appt.id}-COMPLETED`;
                const cancelKey = `${appt.id}-CANCELLED`;
                const isCompleteLoading = buttonLoading[completeKey];
                const isCancelLoading = buttonLoading[cancelKey];
                const isAnyLoading = isCompleteLoading || isCancelLoading;

                return (
                  <Card
                    key={appt.id}
                    title={`${appt.patientFirstname} ${appt.patientLastname}`}
                    subTitle={`${appt.serviceName} - Dr. ${appt.doctorFullName}`}
                    className="shadow-lg rounded-2xl border border-gray-200 p-4 w-80"
                  >
                    <div className="flex flex-col gap-2">
                      <div>
                        <span className="font-semibold">Time: </span>
                        {parseTime(appt.appointmentTime)}
                      </div>
                      <div>
                        <span className="font-semibold">Status: </span>
                        <Tag
                          value={appt.status}
                          severity={statusColor(appt.status)}
                        />
                      </div>

                      {/* Only doctors can update status */}
                      {appt.status === "BOOKED" &&
                        user?.roles?.includes("ROLE_DOCTOR") && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              label={
                                isCompleteLoading ? "Completing..." : "Complete"
                              }
                              severity="success"
                              loading={isCompleteLoading}
                              onClick={() => updateStatus(appt.id, "COMPLETED")}
                              disabled={isAnyLoading}
                            />
                            <Button
                              label={
                                isCancelLoading ? "Cancelling..." : "Cancel"
                              }
                              severity="danger"
                              loading={isCancelLoading}
                              onClick={() => updateStatus(appt.id, "CANCELLED")}
                              disabled={isAnyLoading}
                            />
                          </div>
                        )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabPanel>
      ))}
    </TabView>
  );
};

export default Appointments;
