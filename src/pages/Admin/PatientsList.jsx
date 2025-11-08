import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import PatientDetailsModal from "@/components/Admin/PatientDetailsModal";
import PatientCard from "@/components/Admin/PatientCard";
import SearchBar from "@/components/Common/SearchBar";
import { useApiData } from "@/hooks/useApiData";
import { useSearch } from "@/hooks/useSearch";
import { useModal } from "@/hooks/useModal";

const PatientsList = () => {
  const {
    data: patients,
    filteredData: filteredPatients,
    loading,
    refetch,
  } = useApiData("/patient", {
    entityName: "patients",
    dataKey: "patients",
  });

  const { searchQuery, handleSearch, filteredData } = useSearch(patients, [
    "name",
    "email",
    "contact",
    "gender",
    "address",
  ]);

  const detailsModal = useModal();

  const handleViewPatient = (patient) => {
    detailsModal.open(patient);
  };

  const handleModalClose = () => {
    detailsModal.close();
    refetch();
  };

  // Use filteredData from useSearch when searching, otherwise use filteredPatients from useApiData
  const displayData = searchQuery ? filteredData : filteredPatients || [];

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
          ) : displayData.length === 0 ? (
            <div className="text-center py-12">
              {!patients || patients.length === 0 ? (
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
                  Showing {displayData.length} of {patients.length} patients
                </p>
              </div>

              {/* Patients List - Fixed scrolling container */}
              <div className="h-[calc(100vh-215px)] overflow-y-auto">
                <div className="space-y-3 pr-2 pb-6">
                  {displayData.map((patient) => (
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
        isOpen={detailsModal.isOpen}
        onClose={handleModalClose}
        patient={detailsModal.selectedItem}
        onDelete={handleModalClose}
      />
    </>
  );
};

export default PatientsList;
