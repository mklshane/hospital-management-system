import React, { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import PatientDetailsModal from "@/components/Admin/PatientDetailsModal";
import PatientCard from "@/components/Admin/PatientCard";
import SearchBar from "@/components/Common/SearchBar";
import { api } from "@/lib/axiosHeader";
import toast from "react-hot-toast"; // Import toast

const PatientsList = () => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/patient");
      setPatients(response.data.patients);
      setFilteredPatients(response.data.patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients"); // Changed to toast
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = patients.filter(
      (patient) =>
        patient.name?.toLowerCase().includes(query) ||
        patient.email?.toLowerCase().includes(query) ||
        patient.contact?.includes(query) ||
        patient.gender?.toLowerCase().includes(query) ||
        patient.address?.toLowerCase().includes(query)
    );
    setFilteredPatients(filtered);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setIsDetailsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedPatient(null);
    fetchPatients(); // Refresh the list when modal closes
  };

  return (
    <>
      <div className="min-h-screen bg-ui-surface flex flex-col">
        {/* Header */}
        <header className="border-b border-ui-border px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Patients List</h1>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search Bar */}
          <div className="mb-3">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search patients by name, email, contact, address..."
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              {patients.length === 0 ? (
                <p className="text-muted-foreground text-lg">
                  No patients found
                </p>
              ) : (
                <>
                  <p className="text-muted-foreground text-lg mb-2">
                    No patients match your search
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search terms
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredPatients.length} of {patients.length}{" "}
                  patients
                </p>
              </div>

              {/* Patients List - Fixed scrolling container */}
              <div className="h-[calc(100vh-215px)] overflow-y-auto">
                <div className="space-y-3 pr-2 pb-6">
                  {filteredPatients.map((patient) => (
                    <PatientCard
                      key={patient._id}
                      patient={patient}
                      onClick={handleViewPatient}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Details & Edit Modal */}
      <PatientDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleModalClose}
        patient={selectedPatient}
        onDelete={handleModalClose}
      />
    </>
  );
};

export default PatientsList;
