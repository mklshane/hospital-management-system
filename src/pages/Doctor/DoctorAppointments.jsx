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
        <div className="min-h-screen flex flex-col pb-10">
            <div className="flex-1 grid grid-cols-12 overflow-hidden">
                
                {/* Left - Appointments Section */}
                <div className="col-span-9 bg-ui-card rounded-2xl p-6 text-white flex flex-col overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold font-montserrat text-foreground">Appointments</h1>
                        </div>
            
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 bg-blue-light/20 rounded-full hover:bg-blue-light/40 transition"
                            aria-label="Toggle dark mode"
                            >
                                {isDarkMode ? (
                                    <Sun className="w-5 h-5 text-foreground" />
                            ) : (
                                <Moon className="w-5 h-5 text-foreground" />
                            )}
                        </button>
                </div>
                </div>

                    {/* Right - Appointment Details Section */}
                    <div className="col-span-3 rounded-2xl p-4 overflow-hidden">
                        
                    </div>
                </div>
        </div>
    )
}

export default DoctorAppointments