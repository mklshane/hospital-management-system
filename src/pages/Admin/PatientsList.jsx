import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import PatientDetailsModal from "@/components/Admin/PatientDetailsModal";
import PatientCard from "@/components/Admin/PatientCard";
import SearchBar from "@/components/Common/SearchBar";
import FilterDropdown from "@/components/Common/FilterDropdown";
import ActiveFilters from "@/components/Common/ActiveFilters";
import { useApiData } from "@/hooks/useApiData";
import { useSearch } from "@/hooks/useSearch";
import { useFilter } from "@/hooks/useFilter";
import { useSort } from "@/hooks/useSort";
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

  const {
    searchQuery,
    handleSearch,
    filteredData: searchFilteredData,
  } = useSearch(patients, ["name", "email", "contact", "gender", "address"]);

  // Filter config for patients
  const patientFilterConfig = {
    gender: {
      type: "select",
      label: "Gender",
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
      ],
    },
  };

  const {
    filteredData: filterFilteredData,
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
  } = useFilter(
    searchQuery ? searchFilteredData : filteredPatients || [],
    patientFilterConfig
  );

  const { sortedData, sortField, sortOrder, handleSort } = useSort(
    filterFilteredData,
    "name",
    "asc"
  );

  const detailsModal = useModal();

  const patientSortOptions = [
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "age-asc", label: "Age Low to High" },
    { value: "age-desc", label: "Age High to Low" },
  ];

  const handleSortSelection = (value) => {
    if (value === "") {
      handleSort(""); // Clear sort
      return;
    }

    const [field, order] = value.split("-");
    handleSort(field, order);
  };

  const getCurrentSortValue = () => {
    if (!sortField) return "";
    return `${sortField}-${sortOrder}`;
  };

  // Get display label for current sort
  const getSortDisplayLabel = () => {
    if (!sortField) return "";
    const currentOption = patientSortOptions.find(
      (opt) => opt.value === getCurrentSortValue()
    );
    return currentOption ? currentOption.label : "";
  };

  const handleViewPatient = (patient) => {
    detailsModal.open(patient);
  };

  const handleModalClose = () => {
    detailsModal.close();
    refetch();
  };

  const displayData = sortedData;

  return (
    <>
      <div className="min-h-screen bg-ui-surface flex flex-col">
        {/* Header */}
        <header className="border-b border-ui-border px-4 md:px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Patients List
          </h1>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Search and Filters Section */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="flex-1">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search patients by name, email, contact, address..."
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="w-full sm:w-32">
                <FilterDropdown
                  label="Gender"
                  options={patientFilterConfig.gender.options}
                  value={filters.gender}
                  onChange={(value) => updateFilter("gender", value)}
                  onClear={() => clearFilter("gender")}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-40 md:w-48">
                <FilterDropdown
                  label="Sort by"
                  options={patientSortOptions}
                  value={getCurrentSortValue()}
                  onChange={handleSortSelection}
                  onClear={() => handleSortSelection("")}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <ActiveFilters
            filters={filters}
            filterConfig={patientFilterConfig}
            onClearFilter={clearFilter}
            onClearAll={clearAllFilters}
          />

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
            </div>
          ) : displayData.length === 0 ? (
            <div className="text-center py-12 px-4">
              {!patients || patients.length === 0 ? (
                <p className="text-muted-foreground text-base md:text-lg">
                  No patients found
                </p>
              ) : (
                <>
                  <p className="text-muted-foreground text-base md:text-lg mb-2">
                    No patients match your search and filters
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-4 flex justify-between items-center">
                <p className="text-xs md:text-sm text-muted-foreground">
                  Showing {displayData.length} of {patients.length} patients
                  {sortField && ` • Sorted by ${getSortDisplayLabel()}`}
                </p>
              </div>

              {/* Patients List - Fixed scrolling container */}
              <div className="h-[calc(100vh-220px)] md:h-[calc(100vh-215px)] overflow-y-auto">
                <div className="space-y-3 pr-1 md:pr-2 pb-6">
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
