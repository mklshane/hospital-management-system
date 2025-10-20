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
            <div className="col-span-9 bg-ui-card rounded-2xl p-6 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
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

                {/* Search + Buttons */}
                <div className="flex flex-wrap gap-2 mb-6 items-center">
                <input
                    type="text"
                    placeholder="Search name, date, notes..."
                    className="flex-1 min-w-[200px] px-4 py-2 pl-10 bg-ui-muted border border-ui-border rounded-lg text-foreground placeholder-muted-foreground font-figtree focus:outline-none focus:ring-2 focus:ring-ui-ring"
                />
                <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition">
                    Sort
                </button>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition">
                    + New Appointment
                </button>
                </div>

                {/* Appointment Columns */}
                <div className="grid grid-cols-3 gap-6">
                {/* Pending Section */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 text-foreground">Pending (2)</h2>
                    <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="p-4 rounded-xl border border-border bg-ui-card shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground">M</div>
                            <div>
                            <p className="font-semibold text-foreground">Maria Dela Cruz</p>
                            <p className="text-xs text-yellow-500 font-medium">● Pending</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            <span className="block">📅 Oct 12, 2025 | 09:30 AM – 10:00 AM</span>
                            <span className="block mt-1">Complains of persistent cough and mild fever</span>
                        </p>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Scheduled Section */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 text-foreground">Scheduled (3)</h2>
                    <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 rounded-xl border border-border bg-ui-card shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground">J</div>
                            <div>
                            <p className="font-semibold text-foreground">John Santos</p>
                            <p className="text-xs text-blue-500 font-medium">● Scheduled</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            <span className="block">📅 Oct 10, 2025 | 02:00 PM – 02:30 PM</span>
                            <span className="block mt-1">Routine blood pressure check-up</span>
                        </p>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Completed Section */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 text-foreground">Completed (1)</h2>
                    <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-border bg-ui-card shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground">A</div>
                        <div>
                            <p className="font-semibold text-foreground">Angela Reyes</p>
                            <p className="text-xs text-green-500 font-medium">● Completed</p>
                        </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                        <span className="block">📅 Oct 8, 2025 | 11:00 AM – 11:45 AM</span>
                        <span className="block mt-1">Follow-up consultation after medication</span>
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Right - Appointment Details Section */}
            <div className="col-span-3 p-10">
            <h2 className="text-xl font-bold font-montserrat text-foreground mb-6">Appointment Details</h2>
            
            {/* Patient Information */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-light/20 flex items-center justify-center text-lg font-semibold text-blue">
                    JD
                </div>
                <div>
                    <h3 className="font-bold text-foreground">John Doe</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                    📞 09123465867
                    </p>
                </div>
                </div>
                
                <div className="space-y-3">
                {/* Appointment Date & Time */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">📅</span>
                    <span className="text-foreground">October 15, 2025</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">⏰</span>
                    <span className="text-foreground">10:30 AM - 11:00 AM</span>
                </div>
                
                {/* Status Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    ● Pending
                </div>
                </div>
            </div>

            <div className="border-t border-ui-border pt-4 mb-6">
                {/* Patient Notes/Symptoms */}
                <div className="mb-4">
                <h4 className="font-semibold text-foreground mb-2">Patient Notes</h4>
                <div className="bg-ui-muted rounded-lg p-3">
                    <p className="text-sm text-foreground">
                    Complains of persistent headache and dizziness for the past 3 days. 
                    No fever but experiencing mild nausea.
                    </p>
                </div>
                </div>
                
                {/* Additional Details */}
                <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Appointment ID:</span>
                    <span className="text-foreground font-medium">#APT-00123</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="text-foreground">Oct 10, 2025</span>
                </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button className="w-full bg-blue hover:bg-blue-dark text-white py-3 rounded-lg font-semibold transition-colors">
                Accept Appointment
                </button>
                <button className="w-full border border-red-300 text-red-600 hover:bg-red-50 py-3 rounded-lg font-semibold transition-colors dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20">
                Reject Appointment
                </button>
                <button className="w-full border border-green-300 text-green-600 hover:bg-green-50 py-3 rounded-lg font-semibold transition-colors dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20">
                Complete Appointment
                </button>
            </div>
            </div>
            </div>
        </div>
    )
}

export default DoctorAppointments