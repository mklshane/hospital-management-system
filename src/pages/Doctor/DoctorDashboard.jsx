import React, { useState, useEffect } from 'react';
import { Moon, Sun } from "lucide-react";
import AppointmentCard from "../../components/AppointmentCard";

const DoctorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);
  
  // Mock data
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

  const appointmentsData = [
    {
      patientName: "Maria Dela Cruz",
      status: "Pending",
      date: "Oct 12, 2025",
      time: "09:30 AM – 10:00 AM",
      notes: "Complains of persistent cough and mild fever"
    },
    {
      patientName: "John Santos",
      status: "Approved",
      date: "Oct 10, 2025",
      time: "02:00 PM – 02:30 PM",
      notes: "Routine blood pressure check-up"
    },
    {
      patientName: "John Santos",
      status: "Approved",
      date: "Oct 10, 2025",
      time: "02:00 PM – 02:30 PM",
      notes: "Routine blood pressure check-up"
    }
  ];

  const appointmentRequests = [
    {
      patientName: "Maria Dela Cruz",
      age: 32,
      gender: "Female",
      time: "Today, 09:30 AM",
      symptoms: "Fever and cough for 3 days"
    },
    {
      patientName: "John Doe",
      age: 40,
      gender: "Male", 
      time: "Today, 10:00 AM",
      symptoms: "Routine checkup"
    }
  ];

  // Fetch scheduled appointments for today
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

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  return (
    <div className="h-screen grid grid-cols-12 grid-rows-[0.8fr_1.2fr] gap-4 overflow-hidden pb-10">
      
      {/* Upper Left - Blue Background Section */}
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

      {/* Upper Right - Calendar Section */}
      <div className="col-span-3 row-span-1 rounded-2xl p-1 overflow-hidden">
        {/* <h2 className="text-lg font-semibold text-foreground font-montserrat mb-4">Calendar</h2> */}
        <div className="bg-ui-muted rounded-lg p-4 text-center">
          {/* Calendar Grid */}
          <div className="bg-ui-muted rounded-lg">
            {/* Month Header */}
            <div className="flex justify-between items-center mb-4">
              <button className="px-2 py-1 rounded hover:bg-blue-light/20 transition">&lt;</button>
              <h3 className="text-md font-semibold font-montserrat text-foreground dark:text-white">October 2025</h3>
              <button className="px-2 py-1 rounded hover:bg-blue-light/20 transition">&gt;</button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 text-sm font-figtree text-muted-foreground dark:text-gray-300 mb-2">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => (
                <div key={day} className="text-center">{day}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2 text-sm">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className="p-2 rounded hover:bg-blue-light/20 dark:hover:bg-blue-600 transition text-center cursor-pointer"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Lower Left - Appointments Card with Search */}
      <div className="col-span-9 row-span-1 bg-ui-card rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-ui-border h-[72px] shrink-0">
          <h2 className="text-lg font-semibold text-foreground font-montserrat">Today's Appointment</h2>
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-1/2 lg:w-1/4">
            <input
              type="text"
              placeholder="Search for name, date, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-ui-muted border border-ui-border rounded-lg text-foreground placeholder-muted-foreground font-figtree focus:outline-none focus:ring-2 focus:ring-ui-ring"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
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
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* requests list goes here */}
        </div>
      </div>

    </div>
  );
};

export default DoctorDashboard;