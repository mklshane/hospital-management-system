import React, { useState } from 'react';

const DoctorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
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

  return (
    <div className="h-screen grid grid-cols-12 grid-rows-[0.8fr_1.2fr] gap-6 overflow-hidden">
      
      {/* Upper Left - Blue Background Section */}
      <div className="col-span-9 row-span-1 bg-blue rounded-2xl p-6 text-white flex flex-col">
        {/* Doctor Info */}
        <div>
          <h1 className="text-2xl font-bold font-montserrat">{doctorData.name}</h1>
          <p className="text-blue-light font-figtree">{doctorData.specialization}</p>
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
      <div className="col-span-3 row-span-1 rounded-2xl p-6 overflow-hidden">
        <h2 className="text-lg font-semibold text-foreground font-montserrat mb-4">Calendar</h2>
        <div className="bg-ui-muted rounded-lg p-8 text-center">
          <p className="text-muted-foreground font-figtree">Calendar view will be implemented here</p>
        </div>
      </div>

      {/* Lower Left - Appointments Card with Search */}
      <div className="col-span-9 row-span-1 bg-white rounded-2xl shadow-sm border border-ui-border overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-ui-border h-20">
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
      </div>

      {/* Lower Right - Appointment Requests */}
      <div className="col-span-3 row-span-1 rounded-2xl overflow-y-auto">
        <div className="p-6 border-b border-ui-border">
          <h2 className="text-lg font-semibold text-foreground font-montserrat">Appointment Requests</h2>
        </div>
      </div>

    </div>
  );
};

export default DoctorDashboard;