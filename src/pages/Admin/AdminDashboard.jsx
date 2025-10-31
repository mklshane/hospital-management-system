import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { api } from "@/lib/axiosHeader";

const LOGS_HEIGHT = "calc(100vh - 50px)";

const AdminDashboard = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    todayAppointments: 0,
  });
  const [loading, setLoading] = useState({
    appointments: true,
    patients: true,
    stats: true,
  });
  const navigate = useNavigate();

  const logs = [
    { id: 1, message: "Dr. Juan updated his profile.", time: "10 mins ago" },
    { id: 2, message: "New patient registered: Maria Lopez.", time: "30 mins ago" },
    { id: 3, message: "Appointment #102 approved.", time: "1 hour ago" },
    { id: 4, message: "System backup completed successfully.", time: "2 hours ago" },
    { id: 5, message: "New doctor account created: Dr. Perez.", time: "3 hours ago" },
    { id: 6, message: "Patient data exported by Admin.", time: "5 hours ago" },
    { id: 7, message: "Dr. Santos updated clinic schedule.", time: "6 hours ago" },
    { id: 8, message: "New appointment requested by patient.", time: "7 hours ago" },
    { id: 9, message: "Doctor license verification completed.", time: "8 hours ago" },
    { id: 10, message: "System maintenance check scheduled.", time: "10 hours ago" },
  ];

  /* ── FETCH LOGIC ── */
  const fetchPendingAppointments = async () => {
    try {
      setLoading((p) => ({ ...p, appointments: true }));
      const { data } = await api.get("/appointment");
      const pending = (data.appointments || [])
        .filter((a) => a.status === "Pending")
        .slice(0, 6);
      setPendingAppointments(pending);
    } catch (e) {
      console.error(e);
      setPendingAppointments([]);
    } finally {
      setLoading((p) => ({ ...p, appointments: false }));
    }
  };

  const fetchRecentPatients = async () => {
    try {
      setLoading((p) => ({ ...p, patients: true }));
      const { data } = await api.get("/patient");
      const recent = (data.patients || [])
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6);
      setRecentPatients(recent);
    } catch (e) {
      console.error(e);
      setRecentPatients([]);
    } finally {
      setLoading((p) => ({ ...p, patients: false }));
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading((p) => ({ ...p, stats: true }));
      const [docRes, patRes, aptRes] = await Promise.all([
        api.get("/doctor"),
        api.get("/patient"),
        api.get("/appointment"),
      ]);

      const today = new Date().toISOString().split("T")[0];
      const todayCount = (aptRes.data.appointments || []).filter((a) => {
        const d = new Date(a.appointment_date).toISOString().split("T")[0];
        return d === today;
      }).length;

      setStats({
        totalDoctors: docRes.data.doctors?.length ?? 0,
        totalPatients: patRes.data.patients?.length ?? 0,
        todayAppointments: todayCount,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((p) => ({ ...p, stats: false }));
    }
  };

  useEffect(() => {
    fetchPendingAppointments();
    fetchRecentPatients();
    fetchDashboardStats();
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div >
      <div className="min-h-screen flex flex-col transition-colors duration-300">
       
        <main className="flex-1 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 px-0 lg:px-2">
       
          <section
            className="lg:col-span-3 grid grid-rows-[auto_auto_1fr] gap-6 min-h-0"
            style={{ height: LOGS_HEIGHT }}
          >
            <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 flex justify-between items-center shadow-md">
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm opacity-80">Hospital Management System</p>
              </div>
              <ThemeToggle />
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-6 lg:grid-cols-3">
              <div
                onClick={() => navigate("/admin/doctors")}
                className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-xl shadow hover:opacity-90 transition"
              >
                <h3 className="text-lg font-semibold">Total Doctors</h3>
                <p className="text-3xl font-bold mt-2">{loading.stats ? "..." : stats.totalDoctors}</p>
              </div>

              <div
                onClick={() => navigate("/admin/patients")}
                className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-xl shadow hover:opacity-90 transition"
              >
                <h3 className="text-lg font-semibold">Total Patients</h3>
                <p className="text-3xl font-bold mt-2">{loading.stats ? "..." : stats.totalPatients}</p>
              </div>

              <div
                onClick={() => navigate("/admin/appointments")}
                className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-xl shadow hover:opacity-90 transition"
              >
                <h3 className="text-lg font-semibold">Appointments for Today</h3>
                <p className="text-3xl font-bold mt-2">{loading.stats ? "..." : stats.todayAppointments}</p>
              </div>
            </div>

           
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
       
              <div className="lg:col-span-2 px-6 py-4 rounded-xl shadow border bg-card flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Appointment Requests</h2>
                  <button
                    onClick={() => navigate("/admin/appointments")}
                    className="text-blue-600 text-sm font-semibold hover:underline"
                  >
                    See All
                  </button>
                </div>

                <div className="flex-1 overflow-auto">
                  {loading.appointments ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    </div>
                  ) : pendingAppointments.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No pending appointment requests</p>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="p-2">Patient Name</th>
                          <th className="p-2">Doctor</th>
                          <th className="p-2">Date</th>
                          <th className="p-2">Time</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingAppointments.map((apt) => (
                          <tr key={apt._id} className="border-b border-border hover:bg-muted/50">
                            <td className="p-2 font-medium">{apt.patient?.name ?? "Unknown"}</td>
                            <td className="p-2">Dr. {apt.doctor?.name ?? "Unknown"}</td>
                            <td className="p-2">{formatDate(apt.appointment_date)}</td>
                            <td className="p-2">{apt.appointment_time}</td>
                            <td className="p-2">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                                Pending
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl shadow border bg-card flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Patients</h2>
                  <button
                    onClick={() => navigate("/admin/patients")}
                    className="text-blue-600 text-sm font-semibold hover:underline"
                  >
                    See All
                  </button>
                </div>

                <div className="flex-1 overflow-auto">
                  {loading.patients ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    </div>
                  ) : recentPatients.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No recent patients</p>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="p-2">Name</th>
                          <th className="p-2">Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentPatients.map((p) => (
                          <tr key={p._id} className="border-b border-border hover:bg-muted/50">
                            <td className="p-2 font-medium">{p.name}</td>
                            <td className="p-2 text-muted-foreground">{p.contact ?? "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-1">
            <div
              className="rounded-xl shadow p-6 bg-card flex flex-col"
              style={{ height: LOGS_HEIGHT }}
            >
              <h2 className="text-xl font-semibold mb-4">System Logs</h2>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {logs.map((log) => (
                  <div key={log.id} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-medium text-foreground">{log.message}</p>
                    <span className="text-sm text-muted-foreground">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;