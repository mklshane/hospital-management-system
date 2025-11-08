import React from "react";
import ThemeToggle from "@/components/ThemeToggle";

const DashboardHeader = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 flex justify-between items-center shadow-md">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-xs sm:text-sm opacity-80">
          Hospital Management System
        </p>
      </div>
      <ThemeToggle />
    </header>
  );
};

export default DashboardHeader;
