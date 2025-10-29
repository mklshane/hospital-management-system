import React, { useState, useEffect } from 'react';
import { Moon, Sun, RefreshCw, Search } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { api } from "../../lib/axiosHeader";
import AppointmentCard from "../../components/AppointmentCard";
import AppointmentRequestCard from "../../components/AppointmentRequestCard";

const DoctorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const doctorData = {
    name: "Dr. Juan De La Cruz",
    specialization: "General Medicine"
  };

  const statsData = [
    { label: "Today's Appointments", value: 12 },
    { label: "Pending Approvals", value: 5 },
    { label: "Completed Appointments", value: 7 },
    { label: "Assigned Patients", value: 23 }
  ];

  // Theme handling
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = savedTheme === "dark";
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // API: Fetch today's scheduled appointments
  const fetchTodayAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointment");
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const todayScheduled = (res.data.appointments || [])
        .filter(appt => 
          appt.status === "Scheduled" && 
          appt.appointment_date === today
        )
        .sort((a, b) => {
          const timeA = a.appointment_time;
          const timeB = b.appointment_time;
          return timeA.localeCompare(timeB);
        });

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
        .filter(appt => appt.status === "Pending")
        .map(appt => ({
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

  // API: Fetch all scheduled appointments for calendar
  const fetchCalendarAppointments = async () => {
    try {
      setCalendarLoading(true);
      const res = await api.get("/appointment");

      const scheduled = (res.data.appointments || [])
        .filter(appt => appt.status === "Scheduled")
        .map(appt => ({
          _id: appt._id,
          patient: appt.patient,
          appointment_date: appt.appointment_date,
          appointment_time: appt.appointment_time,
        }));

      setAllAppointments(scheduled);
    } catch (err) {
      console.error("Error fetching calendar data:", err);
    } finally {
      setCalendarLoading(false);
    }
  };

  // API: Update appointment status
  const handleStatusUpdate = async (id, newStatus) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      await api.put(`/appointment/${id}`, { status: newStatus });
      await fetchPendingRequests(); // refresh list
      await fetchTodayAppointments(); // update stats
    } catch (err) {
      console.error(`Failed to ${newStatus} appointment:`, err);
      alert("Action failed. Please try again.");
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTodayAppointments();
    fetchPendingRequests();
    fetchCalendarAppointments();
  }, []);

  // Search filter
  const filteredAppointments = scheduledAppointments.filter(appt =>
    appt.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.appointment_date.includes(searchTerm) ||
    appt.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calendar component (to be transfered)
  const Calendar = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    const appointmentDates = allAppointments.map(a => a.appointment_date);

    return (
      <div className="bg-ui-muted rounded-lg p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
            className="p-1 rounded hover:bg-blue/20 transition text-foreground"
          >
            Less than
          </button>
          <h3 className="text-sm font-semibold font-montserrat text-foreground">
            {format(currentMonth, "MMM yyyy")}
          </h3>
          <button
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
            className="p-1 rounded hover:bg-blue/20 transition text-foreground"
          >
            Greater than
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-xs text-muted-foreground mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map(d => (
            <div key={d} className="text-center">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1 text-xs flex-1">
          {/* Empty cells */}
          {Array.from({ length: start.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Days */}
          {days.map(day => {
            const dateStr = format(day, "yyyy-MM-dd");
            const hasAppt = appointmentDates.includes(dateStr);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={dateStr}
                className={`
                  aspect-square flex items-center justify-center rounded transition text-sm
                  ${hasAppt ? "bg-blue text-white font-bold" : "hover:bg-ui-muted/50"}
                  ${isToday ? "ring-2 ring-blue-light" : ""}
                `}
                title={hasAppt ? `${appointmentDates.filter(d => d === dateStr).length} appointment(s)` : ""}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen grid grid-cols-12 grid-rows-[0.8fr_1.2fr] gap-4 overflow-hidden pb-10">
      
      {/* Upper Left - Doctor Info and Statistics*/}
      <div className="col-span-9 row-span-1 bg-blue rounded-2xl p-6 text-white flex flex-col overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold font-montserrat">{doctorData.name}</h1>
            <p className="text-blue-light font-figtree">{doctorData.specialization}</p>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 bg-blue-light/20 rounded-full hover:bg-blue-light/40 transition"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-4 flex-1">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-blue-light rounded-xl p-4 flex flex-col justify-center h-full">
              <p className="text-md font-figtree opacity-90 mb-1">{stat.label}</p>
              <p className="text-4xl font-bold font-montserrat">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upper Right - Calendar */}
      <div className="col-span-3 row-span-1 bg-ui-card rounded-2xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {calendarLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading calendar...</p>
          ) : (
            <Calendar />
          )}
        </div>
      </div>

      {/* Lower Left - Appointments Card with Search */}
      <div className="col-span-9 row-span-1 bg-ui-card rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-ui-border h-[72px] shrink-0">
          <h2 className="text-lg font-semibold text-foreground font-montserrat">Today's Appointment</h2>
        
          {/* Search Bar */}
         <div className="flex items-center gap-2 w-full sm:w-1/2 lg:w-1/3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search name, date, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-ui-muted border border-ui-border rounded-lg text-foreground placeholder-muted-foreground font-figtree focus:outline-none focus:ring-2 focus:ring-ui-ring"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchTodayAppointments}
              disabled={loading}
              className="p-2 h-10 bg-blue hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Appointment List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading today's appointments...</p>
          ) : scheduledAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No scheduled appointments for today.</p>
          ) : (
            scheduledAppointments.map(appt => (
              <AppointmentCard
                key={appt._id}
                appt={appt}
                formatDate={(dateStr) =>
                  new Date(dateStr).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }
              />
            ))
          )}
        </div>
      </div>

      {/* Lower Right - Appointment Requests */}
      <div className="col-span-3 row-span-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-ui-border">
          <h2 className="text-lg font-semibold text-foreground font-montserrat">Appointment Requests</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {requestsLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading requests...</p>
          ) : requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending requests.</p>
          ) : (
            requests.map(req => (
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
    </div>
  );
};

export default DoctorDashboard;