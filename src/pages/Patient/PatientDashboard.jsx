import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, Download, Search, ChevronLeft, ChevronRight, Plus, Moon, Sun } from 'lucide-react';

const PatientDashboard = () => {
  const [currentMonth, setCurrentMonth] = useState(5);
  const [currentYear, setCurrentYear] = useState(2024);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Issa Pressman',
      status: 'Pending',
      date: 'July 12, 2025',
      time: '10:30 AM - 11:00 AM',
      reason: 'Complaints of persistent cough and mild fever',
      initial: 'I'
    },
    {
      id: 2,
      doctor: 'Dr. James Reid',
      status: 'Scheduled',
      date: 'June 26, 2025',
      time: '09:30 AM - 10:00 AM',
      reason: 'Complaints of persistent cough and mild fever',
      initial: 'J'
    },
    {
      id: 3,
      doctor: 'Dr. Nadine Lustre',
      status: 'Completed',
      date: 'June 13, 2025',
      time: '08:30 AM - 09:00 AM',
      reason: 'Complaints of persistent cough and mild fever',
      initial: 'N'
    },
    {
      id: 4,
      doctor: 'Dr. Yassi Pressman',
      status: 'Rejected',
      date: 'May 10, 2025',
      time: '10:30 AM - 11:00 AM',
      reason: 'Complaints of persistent cough and mild fever',
      initial: 'J'
    },
    {
      id: 5,
      doctor: 'Dr. Julia Montes',
      status: 'Cancelled',
      date: 'May 9, 2025',
      time: '08:30 AM - 09:00 AM',
      reason: 'Complaints of persistent cough and mild fever',
      initial: 'Y'
    }
  ];

  const recentDoctors = [
    { name: 'Dr. Issa Pressman', specialty: 'General Surgeon', appointment: 'Today, 09:00 AM' },
    { name: 'Dr. James Reid', specialty: 'General Surgeon', appointment: 'Today, 09:00 AM' },
    { name: 'Dr. Nadine Lustre', specialty: 'Neurologist', appointment: 'Today, 11:00 AM' },
    { name: 'Dr. Yassi Pressman', specialty: 'Dermatologist', appointment: 'Tomorrow, 08:00 AM' },
    { name: 'Dr. Julia Montes', specialty: 'Plastic Surgeon', appointment: 'June 28, 03:00 PM' },
    { name: 'Dr. Coco Martin', specialty: '', appointment: '' }
  ];

  const highlightedDates = [24, 25, 27, 28];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'text-orange-500';
      case 'Scheduled': return 'text-green-500';
      case 'Completed': return 'text-gray-500';
      case 'Rejected': return 'text-red-500';
      case 'Cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d29] p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Side - 8 columns */}
        <div className="col-span-8 space-y-6">
          {/* Top Row - Patient Info and Medical Records */}
          <div className="grid grid-cols-2 gap-6">
            {/* Patient Info Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white">
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 bg-white rounded-full mr-4"></div>
                <div>
                  <h2 className="text-2xl font-semibold">Maria Santos</h2>
                  <p className="text-blue-100">Patient</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Age</p>
                  <p className="text-xl font-semibold">41</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Sex</p>
                  <p className="text-xl font-semibold">Female</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Blood Type</p>
                  <p className="text-xl font-semibold">O-</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Height</p>
                  <p className="text-xl font-semibold">169 cm</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Weight</p>
                  <p className="text-xl font-semibold">60 kg</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Nationality</p>
                  <p className="text-xl font-semibold">Filipino</p>
                </div>
              </div>
            </div>

            {/* Recent Medical Records */}
            <div className="bg-white dark:bg-[#242938] rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Medical Records</h3>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 bg-gray-100 dark:bg-transparent rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition"
                >
                  {isDarkMode ? <Sun size={20} className="text-gray-400" /> : <Moon size={20} className="text-gray-600" />}
                </button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-[#323948] rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-[#3d4a5c] rounded-lg flex items-center justify-center mr-3">
                        <FileText size={20} className="text-blue-500 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">Blood Test Results</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">July 18, 2025</p>
                      </div>
                    </div>
                    <button className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-700 transition">
                      <Download size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                View All Records
              </button>
            </div>
          </div>

          {/* Appointment History */}
          <div className="bg-white dark:bg-[#242938] rounded-2xl shadow-sm">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Appointment History</h3>
              <div className="relative w-80">
                <input
                  type="text"
                  placeholder="Search for name, date, notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-[#323948] border border-gray-200 dark:border-transparent rounded-lg text-gray-900 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-[#242938]">
              <div className="grid grid-cols-3 gap-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center h-48 cursor-pointer hover:border-blue-400 dark:hover:border-gray-500 transition-colors bg-white dark:bg-[#d1d5db]">
                  <Plus size={48} className="text-gray-400 dark:text-gray-600" />
                </div>

                {appointments.map((apt) => (
                  <div key={apt.id} className="border border-gray-200 dark:border-transparent rounded-xl p-4 hover:shadow-md transition-shadow bg-white dark:bg-[#d1d5db]">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                        <span className="font-semibold text-gray-600 dark:text-white">{apt.initial}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-900">{apt.doctor}</p>
                        <p className={`text-xs ${getStatusColor(apt.status)}`}>● {apt.status}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs text-gray-600 dark:text-gray-600">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-gray-500" />
                        <span>{apt.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-2 text-gray-500" />
                        <span>{apt.time}</span>
                      </div>
                      <div className="flex items-start">
                        <FileText size={14} className="mr-2 mt-0.5 text-gray-500" />
                        <span className="line-clamp-2">{apt.reason}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - 4 columns */}
        <div className="col-span-4 space-y-6">
          {/* Calendar */}
          <div className="bg-white dark:bg-[#242938] rounded-2xl p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">June 26, Wednesday</h3>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">{monthNames[currentMonth]} {currentYear}</h4>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                  <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                  <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isHighlighted = highlightedDates.includes(day);
                const isToday = day === 26;
                return (
                  <div
                    key={day}
                    className={`aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer
                      ${isToday ? 'bg-blue-500 text-white font-semibold' : ''}
                      ${isHighlighted && !isToday ? 'text-blue-500 font-semibold' : ''}
                      ${!isHighlighted && !isToday ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10' : ''}
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Doctors */}
          <div className="bg-white dark:bg-[#242938] rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Doctors</h3>
            <div className="space-y-3">
              {recentDoctors.map((doctor, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-300">{doctor.name}</p>
                    {doctor.specialty && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {doctor.specialty} • {doctor.appointment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;