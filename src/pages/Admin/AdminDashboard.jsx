import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { api } from "@/lib/axiosHeader";

const LOGS_HEIGHT = "calc(100vh - 80px)";

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
    logs: true,
  });
  const [logs, setLogs] = useState([]);
  const [hasMoreLogs, setHasMoreLogs] = useState(true);
  const [page, setPage] = useState(1);
  const logsEndRef = useRef(null);
  const navigate = useNavigate();

  // Safe ref assignment
  const setLogsEndRef = useCallback((node) => {
    logsEndRef.current = node;
  }, []);

  /* ── FETCH APPOINTMENTS ── */
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

  /* ── FETCH RECENT PATIENTS ── */
  const fetchRecentPatients = async () => {
    try {
      setLoading((p) => ({ ...p, patients: true }));
      const { data } = await api.get("/patient");
      const recent = (data.patients || [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
      setRecentPatients(recent);
    } catch (e) {
      console.error(e);
      setRecentPatients([]);
    } finally {
      setLoading((p) => ({ ...p, patients: false }));
    }
  };

  /* ── FETCH STATS ── */
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
        totalDoctors: docRes.data.doctors?.length || 0,
        totalPatients: patRes.data.patients?.length || 0,
        todayAppointments: todayCount,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((p) => ({ ...p, stats: false }));
    }
  };

  /* ── FETCH LOGS (PAGINATED) ── */
  const fetchLogs = async (reset = false) => {
    try {
      setLoading((p) => ({ ...p, logs: !reset }));
      const res = await api.get(`/logs?page=${reset ? 1 : page}&limit=20`);
      const newLogs = res.data.logs || [];

      setLogs((prev) => (reset ? newLogs : [...prev, ...newLogs]));
      setHasMoreLogs(res.data.pagination?.page < res.data.pagination?.pages);
      if (reset) setPage(2);
      else setPage((p) => p + 1);
    } catch (e) {
      console.error("Failed to load logs", e);
    } finally {
      setLoading((p) => ({ ...p, logs: false }));
    }
  };

  // Initial load
  useEffect(() => {
    fetchLogs(true);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMoreLogs || loading.logs) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchLogs();
        }
      },
      { threshold: 0.1 }
    );

    const currentNode = logsEndRef.current;
    if (currentNode) {
      observer.observe(currentNode);
    }

    return () => {
      if (currentNode) {
        observer.unobserve(currentNode);
      }
    };
  }, [hasMoreLogs, loading.logs, logs]);

  /* ── INITIAL DATA LOAD ── */
  useEffect(() => {
    fetchPendingAppointments();
    fetchRecentPatients();
    fetchDashboardStats();
  }, []);

  /* ── HELPERS ── */
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatLogTime = (iso) => {
    const now = Date.now();
    const diff = now - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <main className="flex-1 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-4">
        {/* LEFT COLUMN */}
        <section
          className="lg:col-span-3 grid grid-rows-[auto_auto_1fr] gap-4 sm:gap-6 min-h-0"
          style={{ height: LOGS_HEIGHT }}
        >
          {/* Header */}
          <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 flex justify-between items-center shadow-md">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm opacity-80">
                Hospital Management System
              </p>
            </div>
            <ThemeToggle />
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3">
            <div
              onClick={() => navigate("/admin/doctors")}
              className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 sm:p-6 rounded-xl shadow hover:opacity-90 transition"
            >
              <h3 className="text-base sm:text-lg font-semibold">
                Total Doctors
              </h3>
              <p className="text-2xl sm:text-3xl font-bold mt-2">
                {loading.stats ? "..." : stats.totalDoctors}
              </p>
            </div>

            <div
              onClick={() => navigate("/admin/patients")}
              className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 sm:p-6 rounded-xl shadow hover:opacity-90 transition"
            >
              <h3 className="text-base sm:text-lg font-semibold">
                Total Patients
              </h3>
              <p className="text-2xl sm:text-3xl font-bold mt-2">
                {loading.stats ? "..." : stats.totalPatients}
              </p>
            </div>

            <div
              onClick={() => navigate("/admin/appointments")}
              className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 sm:p-6 rounded-xl shadow hover:opacity-90 transition"
            >
              <h3 className="text-base sm:text-lg font-semibold">
                Appointments for Today
              </h3>
              <p className="text-2xl sm:text-3xl font-bold mt-2">
                {loading.stats ? "..." : stats.todayAppointments}
              </p>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-3 h-full min-h-0">
            {/* Appointment Requests */}
            <div className="lg:col-span-2 p-4 sm:p-6 rounded-xl shadow border bg-card flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Appointment Requests
                </h2>
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
                  <p className="text-center py-8 text-muted-foreground">
                    No pending appointment requests
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[500px]">
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
                          <tr
                            key={apt._id}
                            className="border-b border-border hover:bg-muted/50"
                          >
                            <td className="p-2 font-medium">
                              {apt.patient?.name || "Unknown"}
                            </td>
                            <td className="p-2">
                              Dr. {apt.doctor?.name || "Unknown"}
                            </td>
                            <td className="p-2">
                              {formatDate(apt.appointment_date)}
                            </td>
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
                  </div>
                )}
              </div>
            </div>

            {/* Recent Patients */}
            <div className="p-4 sm:p-6 rounded-xl shadow border bg-card flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Recent Patients
                </h2>
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
                  <p className="text-center py-8 text-muted-foreground">
                    No recent patients
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[300px]">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="p-2">Name</th>
                          <th className="p-2">Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentPatients.map((p) => (
                          <tr
                            key={p._id}
                            className="border-b border-border hover:bg-muted/50"
                          >
                            <td className="p-2 font-medium">{p.name}</td>
                            <td className="p-2 text-muted-foreground">
                              {p.contact || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN – SYSTEM LOGS */}
        <aside className="lg:col-span-1 mt-4 lg:mt-0">
          <div
            className="rounded-xl shadow p-4 sm:p-6 bg-card flex flex-col h-[400px] "
            style={{ height: LOGS_HEIGHT }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              System Logs
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {logs.length === 0 && !loading.logs ? (
                <p className="text-center text-muted-foreground">
                  No logs yet.
                </p>
              ) : (
                <>
                  {logs.map((log) => (
                    <div
                      key={log._id}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <p className="font-medium text-foreground text-sm sm:text-base">
                        {log.message}
                      </p>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {log.createdByName} • {formatLogTime(log.createdAt)}
                      </span>
                    </div>
                  ))}

                  {/* Infinite Scroll Trigger */}
                  {hasMoreLogs && (
                    <div
                      ref={setLogsEndRef}
                      className="py-2 text-center text-sm text-muted-foreground"
                    >
                      Loading more...
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default AdminDashboard;
