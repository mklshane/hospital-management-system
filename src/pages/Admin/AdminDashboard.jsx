import React from "react";
import DashboardHeader from "@/components/Admin/Dashboard/DashboardHeader";
import StatsCards from "@/components/Admin/Dashboard/StatsCards";
import AppointmentRequests from "@/components/Admin/Dashboard/AppointmentRequests";
import RecentPatients from "@/components/Admin/Dashboard/RecentPatients";
import SystemLogs from "@/components/Admin/Dashboard/SystemLogs";
import { useApiData } from "@/hooks/useApiData";

const LOGS_HEIGHT = "calc(100vh - 50px)";

const AdminDashboard = () => {
  // Data fetching
  const {
    data: appointments,
    loading: appointmentsLoading,
    refetch: refetchAppointments,
  } = useApiData("/appointment", {
    entityName: "appointments",
    dataKey: "appointments",
  });

  const {
    data: patients,
    loading: patientsLoading,
    refetch: refetchPatients,
  } = useApiData("/patient", {
    entityName: "patients",
    dataKey: "patients",
  });

  const {
    data: doctors,
    loading: doctorsLoading,
    refetch: refetchDoctors,
  } = useApiData("/doctor", {
    entityName: "doctors",
    dataKey: "doctors",
  });

  // Compute derived data from the hooks
  const pendingAppointments = (appointments || [])
    .filter((a) => a.status === "Pending")
    .slice(0, 6);

  const recentPatients = (patients || [])
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const stats = {
    totalDoctors: doctors?.length || 0,
    totalPatients: patients?.length || 0,
    todayAppointments: (appointments || []).filter((a) => {
      const today = new Date().toISOString().split("T")[0];
      const appointmentDate = new Date(a.appointment_date)
        .toISOString()
        .split("T")[0];
      return appointmentDate === today;
    }).length,
  };

  // Combined loading states
  const loading = {
    appointments: appointmentsLoading,
    patients: patientsLoading,
    stats: doctorsLoading || patientsLoading || appointmentsLoading,
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <main className="flex-1 py-2 sm:py-6 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-3 px-2 sm:px-2">
        {/* LEFT COLUMN */}
        <section
          className="lg:col-span-3 grid grid-rows-[auto_auto_1fr] gap-4 sm:gap-4 min-h-0"
          style={{ height: LOGS_HEIGHT }}
        >
          <DashboardHeader />

          <StatsCards stats={stats} loading={loading.stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-3 h-full min-h-0">
            <AppointmentRequests
              appointments={pendingAppointments}
              loading={loading.appointments}
            />
            <RecentPatients
              patients={recentPatients}
              loading={loading.patients}
            />
          </div>
        </section>

        {/* RIGHT COLUMN – SYSTEM LOGS */}
        <aside className="lg:col-span-1 mt-4 lg:mt-0">
          <SystemLogs />
        </aside>
      </main>
    </div>
  );
};

export default AdminDashboard;
