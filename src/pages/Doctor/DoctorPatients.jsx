import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const DoctorPatients = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Dark mode persistence
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

  return (
    <div className="min-h-screen flex flex-col pb-10">
      <div className="flex-1 grid grid-cols-12 overflow-y-auto gap-5">
        {/* LEFT SECTION - APPOINTMENTS */}
        <div className="scrollbar col-span-9 bg-ui-card rounded-2xl p-6 flex flex-col overflow-y-auto max-h-[95vh] relative">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold font-montserrat text-foreground">My Patients</h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-blue-light/20 rounded-full hover:bg-blue-light/40 transition"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
            </button>
          </div>

          {/* Dynamic Columns */}
          <div className="grid grid-cols-3 gap-6">
            <p>Patients Cards</p>
          </div>
        </div>

        {/* RIGHT SECTION - DETAILS */}
        <div className="col-span-3 bg-ui-card rounded-2xl p-8 flex flex-col overflow-y-auto p-6">
          <h2 className="text-xl font-bold font-montserrat text-foreground mb-6">Patient Details</h2>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;