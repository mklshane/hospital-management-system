// components/PatientAppointment.jsx
import React, { useState, useMemo } from "react";
import { Search, Plus, Filter, X } from "lucide-react";
import DoctorCard from "@/components/Patient/Book/DoctorCard";
import DoctorDetails from "@/components/Patient/Book/DoctorDetails";
import BookAppointmentModal from "@/components/Patient/BookAppointmentModal";
import { useApiData } from "@/hooks/useApiData";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import ThemeToggle from "@/components/ThemeToggle";

const PatientAppointment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: doctors,
    loading,
    refetch,
  } = useApiData("/doctor", {
    entityName: "doctors",
  });

  const { create, loading: submitting } = useCrudOperations(
    "Appointment",
    refetch
  );

  const [form, setForm] = useState({
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  /* ----------  Unique specializations ---------- */
  const specializations = useMemo(() => {
    const specs = [
      ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
    ];
    return specs.sort((a, b) => a.localeCompare(b));
  }, [doctors]);

  /* ----------  Filtered doctors (search + filter) ---------- */
  const filteredDoctors = useMemo(() => {
    let result = [...doctors];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(term) ||
          doc.specialization.toLowerCase().includes(term)
      );
    }

    if (selectedSpecialization) {
      result = result.filter(
        (doc) => doc.specialization === selectedSpecialization
      );
    }

    return result;
  }, [doctors, searchTerm, selectedSpecialization]);

  /* ----------  Handlers ---------- */
  const handleBook = (doctor) => {
    setForm((prev) => ({ ...prev, doctor_id: doctor._id }));
    setIsModalOpen(true);
  };

  const handleViewDetails = (doctor) => setSelectedDoctor(doctor);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setForm({
      doctor_id: "",
      appointment_date: "",
      appointment_time: "",
      notes: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await create(form, "/appointments");
    if (success) handleModalClose();
  };

  const clearFilter = () => setSelectedSpecialization("");

  return (
    <>
      <div className="w-full bg-gray-50 dark:bg-gray-900 h-full flex gap-3">
        {/* ==================== LEFT SIDE  ==================== */}
        <div className="flex-1 min-w-0 flex flex-col h-full">
          <div className="bg-ui-card border-2 rounded-2xl flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search doctor, specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-ui-card dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Filter + New Booking + Theme */}
                <div className="flex gap-2 w-full sm:w-auto items-center">
                  {/* Specialization dropdown */}
                  <div className="relative">
                    <select
                      value={selectedSpecialization}
                      onChange={(e) =>
                        setSelectedSpecialization(e.target.value)
                      }
                      className="appearance-none bg-ui-card dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-10 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="">All Specializations</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
                  </div>

                  {/* Clear filter */}
                  {selectedSpecialization && (
                    <button
                      onClick={clearFilter}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      title="Clear filter"
                    >
                      <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  )}

                  {/* New Booking */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition"
                  >
                    <Plus className="w-4 h-4" />
                    New Booking
                  </button>

                  <ThemeToggle />
                </div>
              </div>
            </div>

            {/* Active filter badge (inside scrollable area) */}
            {selectedSpecialization && (
              <div className="px-4 pt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>Filtered by:</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full font-medium">
                  {selectedSpecialization}
                </span>
                <button
                  onClick={clearFilter}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Scrollable doctor grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 dark:bg-gray-700 rounded-xl h-48 animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  {selectedSpecialization
                    ? `No doctors found in "${selectedSpecialization}"`
                    : "No doctors match your search."}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard
                      key={doctor._id}
                      doctor={doctor}
                      onBook={handleBook}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================== RIGHT SIDE (DETAILS) ==================== */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <DoctorDetails doctor={selectedDoctor} onBook={handleBook} />
        </div>
      </div>

      {/* ==================== MODAL ==================== */}
      <BookAppointmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        doctors={doctors}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </>
  );
};

export default PatientAppointment;
