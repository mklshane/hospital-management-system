import React from "react";
import ThemeToggle from "../../components/ThemeToggle";

const DoctorPatients = () => {
  return (
    <div className="min-h-screen flex flex-col pb-10">
      <div className="flex-1 grid grid-cols-12 overflow-y-auto gap-5">
        {/* LEFT SECTION - PATIENTS LIST */}
        <div className="scrollbar col-span-9 bg-ui-card rounded-2xl p-6 flex flex-col overflow-y-auto max-h-[95vh] relative">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold font-montserrat text-foreground">
              My Patients
            </h1>
            {/* Universal Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Patients Grid / List */}
          <div className="grid grid-cols-3 gap-6">
            <p className="text-muted-foreground">Patient Cards</p>
            {/* Future: Map over patients here */}
          </div>
        </div>

        {/* RIGHT SECTION - PATIENT DETAILS */}
        <div className="col-span-3 bg-ui-card rounded-2xl p-8 flex flex-col overflow-y-auto">
          <h2 className="text-xl font-bold font-montserrat text-foreground mb-6">
            Patient Details
          </h2>

          <p className="text-muted-foreground">
            Select a patient to view details.
          </p>
          {/* Future: Show selected patient info, appointments, records, etc. */}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
