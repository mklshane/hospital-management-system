import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import CreateDoctorModal from "@/components/Admin/CreateDoctorModal";
import DoctorDetailsModal from "@/components/Admin/DoctorDetailsModal";
import DoctorCard from "@/components/Admin/DoctorCard";
import SearchBar from "@/components/Common/SearchBar";
import DeleteModal from "@/components/Common/DeleteModal";
import { useApiData } from "@/hooks/useApiData";
import { useSearch } from "@/hooks/useSearch";
import { useModal } from "@/hooks/useModal";
import { useCrudOperations } from "@/hooks/useCrudOperations";

const DoctorsList = () => {
  const {
    data: doctors,
    filteredData: filteredDoctors,
    loading,
    refetch,
  } = useApiData("/doctor", { entityName: "doctors" });

  const { searchQuery, handleSearch, filteredData } = useSearch(doctors, [
    "name",
    "email",
    "specialization",
    "contact",
    "gender",
  ]);

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

  // Use filteredData from useSearch hook when searching, otherwise use filteredDoctors from useApiData
  const displayData = searchQuery ? filteredData : filteredDoctors || [];

  return (
    <>
      <div className="min-h-screen bg-ui-surface flex flex-col">
        <header className="border-b border-ui-border px-6 pt-4 pb-1 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Doctors List</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCreateDoctor}
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

        <main className="flex-1 p-6">
          <div className="mb-3">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search doctors by name, email, specialization, contact..."
              className="max-w-lg"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
            </div>
          ) : displayData.length === 0 ? (
            <div className="text-center py-12">
              {!doctors || doctors.length === 0 ? (
                <>
                  <p className="text-muted-foreground text-lg mb-4">
                    No doctors found
                  </p>
                  <button
                    onClick={handleCreateDoctor}
                    className="bg-blue hover:bg-blue/90 text-white px-6 py-2 rounded-lg transition"
                  >
                    Create Your First Doctor
                  </button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground text-lg mb-2">
                    No doctors match your search
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search terms
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="mb-2 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {displayData.length} of {doctors.length} doctors
                </p>
              </div>

              <div className="h-[calc(100vh-195px)] overflow-y-auto">
                <div className="space-y-3 pr-2 pb-6">
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
