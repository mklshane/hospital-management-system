import React, { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import CreateDoctorModal from "@/components/Admin/CreateDoctorModal";
import DoctorDetailsModal from "@/components/Admin/DoctorDetailsModal";
import DoctorCard from "@/components/Admin/DoctorCard";
import SearchBar from "@/components/Common/SearchBar";
import DeleteModal from "@/components/Common/DeleteModal";
import { api } from "@/lib/axiosHeader";

const DoctorsList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/doctor");
      setDoctors(response.data.doctors);
      setFilteredDoctors(response.data.doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setFilteredDoctors(doctors);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = doctors.filter(
      (doctor) =>
        doctor.name?.toLowerCase().includes(query) ||
        doctor.email?.toLowerCase().includes(query) ||
        doctor.specialization?.toLowerCase().includes(query) ||
        doctor.contact?.includes(query) ||
        doctor.gender?.toLowerCase().includes(query)
    );
    setFilteredDoctors(filtered);
  };

  const handleCreateDoctor = () => {
    setSelectedDoctor(null);
    setModalMode("create");
    setIsCreateModalOpen(true);
  };

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailsModalOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setModalMode("edit");
    setIsCreateModalOpen(true);
  };

  const handleDeleteDoctor = (doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/doctor/${doctorToDelete._id}`);
      alert("Doctor deleted successfully!");
      setIsDeleteModalOpen(false);
      setDoctorToDelete(null);
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedDoctor(null);
    fetchDoctors();
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDoctorToDelete(null);
  };

  return (
    <>
      <div className="min-h-screen bg-ui-surface flex flex-col">
        {/* Header */}
        <header className="border-b border-ui-border px-6 py-4 flex justify-between items-center">
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

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search Bar */}
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
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              {doctors.length === 0 ? (
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
              {/* Results Count */}
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredDoctors.length} of {doctors.length} doctors
                </p>
              </div>

              {/* Doctors List - Single column layout like patients */}
              <div className="h-[calc(100vh-280px)] overflow-y-auto">
                <div className="space-y-3 pr-2 pb-6">
                  {filteredDoctors.map((doctor) => (
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

      {/* Create/Edit Modal */}
      <CreateDoctorModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        doctor={selectedDoctor}
        mode={modalMode}
      />

      {/* Details Modal */}
      <DoctorDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleModalClose}
        doctor={selectedDoctor}
        onDelete={handleDeleteDoctor}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Doctor"
        description="Are you sure you want to delete this doctor? All associated data including appointments will be permanently removed. This action cannot be undone."
        confirmText="Delete Doctor"
        loading={deleteLoading}
        itemName={`Dr. ${doctorToDelete?.name || ""}${
          doctorToDelete?.specialization
            ? ` (${doctorToDelete.specialization})`
            : ""
        }`}
      />
    </>
  );
};

export default DoctorsList;
