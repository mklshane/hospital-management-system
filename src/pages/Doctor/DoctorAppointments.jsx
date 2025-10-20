import React, { useState, useEffect } from 'react';
import { Moon, Sun } from "lucide-react";

const DoctorAppointments = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    
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
  
    return (
        <div className="h-screen grid grid-cols-12 gap-4 overflow-hidden">
        
        {/* Left - Appointments Section */}
        <div className="col-span-9 bg-ui-card rounded-2xl p-6 text-white flex flex-col overflow-hidden">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold font-montserrat text-blue">Appointments</h1>
                </div>
    
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 bg-blue-light/20 rounded-full hover:bg-blue-light/40 transition"
                    aria-label="Toggle dark mode"
                >
                    {isDarkMode ? (
                        <Sun className="w-5 h-5 text-blue" />
                 ) : (
                    <Moon className="w-5 h-5 text-blue" />
                )}
                </button>
            </div>
        </div>

        {/* Right - Appointment Details Section */}
        <div className="col-span-3 rounded-2xl p-4 overflow-hidden">
            
        </div>

        {/* Lower Left - Appointments Card with Search
        <div className="col-span-9 row-span-1 bg-ui-card rounded-2xl shadow-sm border border-ui-border overflow-hidden">
            
        </div>

        Lower Right - Appointment Requests
        <div className="col-span-3 row-span-1 rounded-2xl flex flex-col overflow-hidden">
            
        </div> */}

        </div>
    )
}

export default DoctorAppointments