import React, { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import CreateDoctorModal from "@/components/Admin/CreateDoctorModal";

const DoctorsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-ui-surface">
        {/* Header */}
        <header className="border-b border-ui-border px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Doctors List</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue hover:bg-blue/90 text-white px-4 py-2 rounded-lg shadow transition flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Doctor Account
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <p className="text-muted-foreground">
            All doctors will be displayed here.
          </p>
        </main>
      </div>

      {/* Modal */}
      <CreateDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default DoctorsList;
