import React, { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import CreateDoctorModal from "@/components/Admin/CreateDoctorModal";
import DoctorCard from "@/components/Admin/DoctorCard";
import SearchBar from "@/components/Common/SearchBar";
import { api } from "@/lib/axiosHeader";

const DoctorsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/doctor");
      setDoctors(response.data.doctors);
      setFilteredDoctors(response.data.doctors); // Initialize filtered doctors
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
    setIsModalOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteDoctor = async (doctorId, doctorName) => {
    if (!confirm(`Are you sure you want to delete Dr. ${doctorName}?`)) {
      return;
    }

    try {
      await api.delete(`/doctor/${doctorId}`);
      alert("Doctor deleted successfully!");
      fetchDoctors(); // Refresh the list
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    fetchDoctors(); // Refresh list after any operation
  };

  return (
    <>
      <div className="min-h-screen bg-ui-surface">
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
        <main className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
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

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    onEdit={handleEditDoctor}
                    onDelete={handleDeleteDoctor}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modal */}
      <CreateDoctorModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        doctor={selectedDoctor}
        mode={modalMode}
      />
    </>
  );
};

export default DoctorsList;
