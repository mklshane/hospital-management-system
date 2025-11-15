import React, { useState, useMemo } from "react";
import { Search, Plus, X } from "lucide-react";
import DoctorCard from "./DoctorCard";
import DoctorDetails from "./DoctorDetails";
import { useApiData } from "@/hooks/useApiData";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import BookAppointmentModal from "../BookAppointmentModal";

const PatientAppointment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);

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

  // Form state for booking
  const [form, setForm] = useState({
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    if (!searchTerm) return doctors;
    const term = searchTerm.toLowerCase();
    return doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(term) ||
        doc.specialization.toLowerCase().includes(term)
    );
  }, [doctors, searchTerm]);

  const handleBook = (doctor) => {
    setBookingDoctor(doctor);
    setForm((prev) => ({ ...prev, doctor_id: doctor._id }));
    setIsModalOpen(true);
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setBookingDoctor(null);
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
    if (success) {
      handleModalClose();
    }
  };

  return (
    <>
      <div className="w-full p-4 bg-gray-50 rounded-2xl h-full flex gap-6">
        {/* Left: Doctor Grid */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patient, diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                  Sort
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  New Booking
                </button>
              </div>
            </div>
          </div>

          {/* Doctor Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl h-48 animate-pulse"
                />
              ))}
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

          {!loading && filteredDoctors.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No doctors found matching your search.
            </div>
          )}
        </div>

        {/* Right: Doctor Details */}
        <div className="hidden lg:block w-80 shrink-0">
          <DoctorDetails doctor={selectedDoctor} />
        </div>
      </div>

      {/* Booking Modal */}
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
