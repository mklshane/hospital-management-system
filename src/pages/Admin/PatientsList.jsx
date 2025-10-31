import React from "react";
import ThemeToggle from "@/components/ThemeToggle";

const PatientsList = () => (
  <div className="min-h-screen bg-ui-surface">
    {/* Header */}
    <header className=" border-b border-ui-border px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-foreground">Patients List</h1>
      <ThemeToggle />
    </header>

    {/* Main Content */}
    <main className="p-6">
      <p className="text-muted-foreground">
        All registered patients will be displayed here.
      </p>
    </main>
  </div>
);

export default PatientsList;
