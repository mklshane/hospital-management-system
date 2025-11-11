import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import CreateDoctorModal from "@/components/Admin/CreateDoctorModal";
import DoctorDetailsModal from "@/components/Admin/DoctorDetailsModal";
import DoctorCard from "@/components/Admin/DoctorCard";
import SearchBar from "@/components/Common/SearchBar";
import FilterDropdown from "@/components/Common/FilterDropdown";
import ActiveFilters from "@/components/Common/ActiveFilters";
import DeleteModal from "@/components/Common/DeleteModal";
import { useApiData } from "@/hooks/useApiData";
import { useSearch } from "@/hooks/useSearch";
import { useFilter } from "@/hooks/useFilter";
import { useSort } from "@/hooks/useSort";
import { useModal } from "@/hooks/useModal";
import { useCrudOperations } from "@/hooks/useCrudOperations";

const DoctorsList = () => {
  const {
    data: doctors,
    filteredData: filteredDoctors,
    loading,
    refetch,
  } = useApiData("/doctor", {
    entityName: "doctors",
    dataKey: "doctors",
  });

  const {
    searchQuery,
    handleSearch,
    filteredData: searchFilteredData,
  } = useSearch(doctors, [
    "name",
    "email",
    "specialization",
    "contact",
    "gender",
  ]);

  // Filter config for doctors
  const doctorFilterConfig = {
    specialization: {
      type: "select",
      label: "Specialization",
      options: [
        { value: "Cardiology", label: "Cardiology" },
        { value: "Dermatology", label: "Dermatology" },
        { value: "Neurology", label: "Neurology" },
        { value: "Pediatrics", label: "Pediatrics" },
        { value: "Orthopedics", label: "Orthopedics" },
        { value: "Gynecology", label: "Gynecology" },
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
    searchQuery ? searchFilteredData : filteredDoctors || [],
    doctorFilterConfig
  );

  const { sortedData, sortField, sortOrder, handleSort } =
    useSort(filterFilteredData);

  const createModal = useModal();
  const detailsModal = useModal();
  const deleteModal = useModal();

  const { deleteLoading, deleteItem } = useCrudOperations("doctor", refetch);

  const handleCreateDoctor = () => {
    createModal.open();
  };

  const handleViewDoctor = (doctor) => {
    detailsModal.open(doctor);
  };

  const handleDeleteDoctor = (doctor) => {
    deleteModal.open(doctor);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.selectedItem) return;

    const success = await deleteItem(deleteModal.selectedItem._id, "/doctor");
    if (success) {
      deleteModal.close();
    }
  };

  const handleModalClose = () => {
    createModal.close();
    detailsModal.close();
    refetch();
  };

  const handleDeleteModalClose = () => {
    deleteModal.close();
  };

  const displayData = sortedData;

  return (
    <>
      <div className="min-h-screen bg-ui-surface flex flex-col">
        <header className="border-b border-ui-border px-4 md:px-6 pt-4 pb-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Doctors List
          </h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleCreateDoctor}
              className="bg-blue hover:bg-blue/90 text-white px-3 md:px-4 py-2 rounded-lg shadow transition flex items-center gap-2 text-sm md:text-base w-full sm:w-auto justify-center"
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
              <span className="hidden sm:inline">Create Doctor</span>
              <span className="sm:hidden">Add Doctor</span>
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="flex-1">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search doctors..."
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <FilterDropdown
                label="Specialization"
                options={doctorFilterConfig.specialization.options}
                value={filters.specialization}
                onChange={(value) => updateFilter("specialization", value)}
                onClear={() => clearFilter("specialization")}
                className="w-full"
              />
            </div>
          </div>

          <ActiveFilters
            filters={filters}
            filterConfig={doctorFilterConfig}
            onClearFilter={clearFilter}
            onClearAll={clearAllFilters}
          />

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
            </div>
          ) : displayData.length === 0 ? (
            <div className="text-center py-12 px-4">
              {!doctors || doctors.length === 0 ? (
                <>
                  <p className="text-muted-foreground text-lg mb-4">
                    No doctors found
                  </p>
                  <button
                    onClick={handleCreateDoctor}
                    className="bg-blue hover:bg-blue/90 text-white px-6 py-2 rounded-lg transition text-sm md:text-base"
                  >
                    Create Your First Doctor
                  </button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground text-base md:text-lg mb-2">
                    No doctors match your search and filters
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="mb-2 flex justify-between items-center">
                <p className="text-xs md:text-sm text-muted-foreground">
                  Showing {displayData.length} of {doctors.length} doctors
                  {sortField &&
                    ` • Sorted by ${sortField} ${
                      sortOrder === "asc" ? "↑" : "↓"
                    }`}
                </p>
              </div>

              <div className="h-[calc(100vh-220px)] md:h-[calc(100vh-195px)] overflow-y-auto">
                <div className="space-y-3 pr-1 md:pr-2 pb-6">
                  {displayData.map((doctor) => (
                    <DoctorCard
                      key={doctor._id}
                      doctor={doctor}
                      onClick={handleViewDoctor}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <CreateDoctorModal
        isOpen={createModal.isOpen}
        onClose={handleModalClose}
        doctor={createModal.selectedItem}
        mode={createModal.selectedItem ? "edit" : "create"}
      />

      <DoctorDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={handleModalClose}
        doctor={detailsModal.selectedItem}
        onDelete={handleDeleteDoctor}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Doctor"
        description="Are you sure you want to delete this doctor? All associated data including appointments will be permanently removed. This action cannot be undone."
        confirmText="Delete Doctor"
        loading={deleteLoading}
        itemName={`Dr. ${deleteModal.selectedItem?.name || ""}${
          deleteModal.selectedItem?.specialization
            ? ` (${deleteModal.selectedItem.specialization})`
            : ""
        }`}
      />
    </>
  );
};

export default DoctorsList;
