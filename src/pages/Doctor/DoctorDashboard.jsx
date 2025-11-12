import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Search,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
} from "lucide-react";
import { api } from "../../lib/axiosHeader";
import AppointmentCard from "../../components/Doctor/AppointmentCard";
import AppointmentRequestCard from "../../components/Doctor/AppointmentRequestCard";
import ThemeToggle from "../../components/ThemeToggle";

const DoctorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const [doctorInfo, setDoctorInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(true);

  const getLocalToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateString = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // API: Fetch doctor profile and stats
  const fetchDoctorProfile = async () => {
    try {
      setDoctorLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const doctorId = user?._id;

      if (!doctorId) throw new Error("Doctor ID not found");

      const docRes = await api.get(`/doctor/${doctorId}`);
      const { name, specialization } = docRes.data.doctor;
      setDoctorInfo({ name, specialization });

      const apptRes = await api.get("/appointment");
      const allAppts = apptRes.data.appointments || [];
      
      const today = getLocalToday();

      const todayAppts = allAppts.filter((a) => formatDateString(a.appointment_date) === today);
      const scheduled = todayAppts.filter((a) => a.status === "Scheduled").length;
      
      const pendingAll = allAppts.filter((a) => a.status === "Pending").length;
      const completedAll = allAppts.filter(
        (a) => a.status === "Completed"
      ).length;

      const uniquePatients = new Set(allAppts.map((a) => a.patient?._id)).size;

      setStats({
        today: scheduled,
        pending: pendingAll,
        completed: completedAll,
        patients: uniquePatients,
      });
    } catch (err) {
      console.error("Error loading doctor profile / stats:", err);
      setDoctorInfo({
        name: "Dr. Juan De La Cruz",
        specialization: "General Medicine",
      });
      setStats({ today: 0, pending: 0, completed: 0, patients: 0 });
    } finally {
      setDoctorLoading(false);
    }
  };

  // API: Fetch today's scheduled appointments
  const fetchTodayAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointment");
      const today = getLocalToday();

      const todayScheduled = (res.data.appointments || [])
        .filter((appt) => 
          appt.status === "Scheduled" && 
          formatDateString(appt.appointment_date) === today
        )
        .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));

      setScheduledAppointments(todayScheduled);
    } catch (err) {
      console.error("Error fetching today's appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  // API: Fetch pending appointment requests
  const fetchPendingRequests = async () => {
    try {
      setRequestsLoading(true);
      const res = await api.get("/appointment");

      const pending = (res.data.appointments || [])
        .filter((appt) => appt.status === "Pending")
        .map((appt) => ({
          _id: appt._id,
          patient: appt.patient,
          appointment_date: appt.appointment_date,
          appointment_time: appt.appointment_time,
          notes: appt.notes,
        }))
        .sort((a, b) => {
          const dateA = new Date(a.appointment_date + " " + a.appointment_time);
          const dateB = new Date(b.appointment_date + " " + b.appointment_time);
          return dateA - dateB;
        });

      setRequests(pending);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setRequestsLoading(false);
    }
  };

  // API: Update appointment status
  const handleStatusUpdate = async (id, newStatus) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await api.put(`/appointment/${id}`, { status: newStatus });
      await fetchPendingRequests();
      await fetchTodayAppointments();
    } catch (err) {
      console.error(`Failed to ${newStatus} appointment:`, err);
      alert("Action failed. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDoctorProfile();
    fetchTodayAppointments();
    fetchPendingRequests();
  }, []);

  // Search filter
  const filteredAppointments = scheduledAppointments.filter(
    (appt) =>
      appt.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.appointment_date.includes(searchTerm) ||
      appt.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen grid grid-cols-12 grid-rows-[auto_1fr] gap-3 pb-8 overflow-hidden bg-ui-background">
      {/* Left Column - Stats (Top) and Today's Appointments (Bottom) */}

      {/* Stats Section - Top Left */}
      <div className="col-span-9 row-span-1 bg-blue rounded-xl p-4 text-white flex flex-col min-h-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            {doctorLoading ? (
              <>
                <div className="h-7 w-48 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-white/15 rounded animate-pulse"></div>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold font-montserrat">
                  Dr. {doctorInfo?.name ?? "Dr. Unknown"}
                </h1>
                <p className="text-blue-200 font-figtree text-sm">
                  {doctorInfo?.specialization ?? "—"}
                </p>
              </>
            )}
          </div>

          <div className="scale-90">
            <ThemeToggle />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 flex-1 min-h-0">
          {doctorLoading || !stats
            ? /* ----- SKELETON ----- */
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex flex-col justify-center border border-white/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                    <div className="h-3 w-20 bg-white/30 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 w-16 bg-white/20 rounded animate-pulse"></div>
                </div>
              ))
            : /* ----- REAL STATS – PROPERLY SIZED ----- */
              [
                {
                  label: "Today's Appointments",
                  value: stats.today,
                  icon: <Clock className="w-4 h-4" />,
                  bg: "bg-blue-500",
                },
                {
                  label: "Pending Approvals",
                  value: stats.pending,
                  icon: <AlertCircle className="w-4 h-4" />,
                  bg: "bg-amber-500",
                },
                {
                  label: "Completed Appointments",
                  value: stats.completed,
                  icon: <CheckCircle2 className="w-4 h-4" />,
                  bg: "bg-emerald-500",
                },
                {
                  label: "Assigned Patients",
                  value: stats.patients,
                  icon: <Users className="w-4 h-4" />,
                  bg: "bg-indigo-500",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex flex-col justify-center border border-white/20 transition-all duration-200 hover:bg-white/15"
                >
                  {/* Icon + Label */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`${stat.bg} text-white p-1.5 rounded-full`}>
                      {stat.icon}
                    </div>
                    <p className="text-xs font-figtree opacity-90 leading-tight">
                      {stat.label}
                    </p>
                  </div>

                  {/* PROPERLY SIZED VALUE */}
                  <p className="text-2xl font-bold font-montserrat leading-none">
                    {stat.value}
                  </p>
                </div>
              ))}
        </div>
      </div>

      {/* Right Column - Appointment Requests (Full Height) - NARROWER */}
      <div className="col-span-3 row-span-2 flex flex-col overflow-hidden bg-ui-card rounded-xl min-h-0">
        <div className="p-3 border-b border-ui-border shrink-0">
          <h2 className="text-base font-semibold text-foreground font-montserrat">
            Appointment Requests
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
          {requestsLoading ? (
            <p className="text-center text-muted-foreground py-6 text-xs">
              Loading requests...
            </p>
          ) : requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-6 text-xs">
              No pending requests.
            </p>
          ) : (
            requests.map((req) => (
              <AppointmentRequestCard
                key={req._id}
                request={req}
                onApprove={(id) => handleStatusUpdate(id, "Scheduled")}
                onReject={(id) => handleStatusUpdate(id, "Rejected")}
                loading={actionLoading[req._id]}
              />
            ))
          )}
        </div>
      </div>

      {/* Today's Appointments - Bottom Left */}
      <div className="col-span-9 row-span-1 bg-ui-card rounded-xl overflow-hidden flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-ui-border shrink-0">
          <h2 className="text-lg font-semibold text-foreground font-montserrat">
            Today's Appointments
          </h2>

          {/* Search Bar */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search name, date, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-9 bg-ui-muted border border-ui-border rounded-lg text-sm text-foreground placeholder-muted-foreground font-figtree focus:outline-none focus:ring-1 focus:ring-ui-ring"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchTodayAppointments}
              disabled={loading}
              className="p-2 h-9 bg-blue hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title="Refresh"
            >
              <RefreshCw
                className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Appointment List */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {loading ? (
            <p className="text-center text-muted-foreground py-8 text-sm">
              Loading today's appointments...
            </p>
          ) : scheduledAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">
              No scheduled appointments for today.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredAppointments.map((appt, index) => (
                <div
                  key={appt._id}
                  className="h-full min-h-[130px]" // Ensures equal height
                >
                  <AppointmentCard
                    appt={appt}
                    formatDate={(dateStr) =>
                      new Date(dateStr).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
