import React, { useEffect, useState, useMemo } from "react";
import { FileText, AlertCircle } from "lucide-react";
import { api } from "@/lib/axiosHeader";
import ThemeToggle from "@/components/ThemeToggle";
import CompletedAppointmentCard from "@/components/Patient/CompletedAppointmentCard";
import SearchBar from "@/components/Common/SearchBar";

const PatientMedical = () => {
  const [appointments, setAppointments] = useState([]);
  const [recordsMap, setRecordsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const patientId = user?._id || user?.id;

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch all appointments
        const apptRes = await api.get("/appointment");
        const allAppointments = (apptRes.data?.appointments || [])
          .filter((a) => a.status === "Completed")
          .sort(
            (a, b) =>
              new Date(b.appointment_date) - new Date(a.appointment_date)
          );

        // 2. Fetch all records
        const recordRes = await api.get(`/record/${patientId}`);
        const allRecords = recordRes.data?.records || [];

        // 3. Map records to appointment ID
        const map = {};
        allRecords.forEach((record) => {
          const apptId = record.appointment?._id;
          if (apptId) {
            if (!map[apptId]) map[apptId] = [];
            map[apptId].push(record);
          }
        });
        setRecordsMap(map);

        // 4. Filter: Only completed appointments WITH records
        const appointmentsWithRecords = allAppointments.filter(
          (appt) => map[appt._id] && map[appt._id].length > 0
        );

        setAppointments(appointmentsWithRecords);
      } catch (err) {
        console.error("Load error:", err);
        setError("Failed to load medical history.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  // Search filter
  const filteredAppointments = useMemo(() => {
    if (!searchTerm) return appointments;

    const term = searchTerm.toLowerCase();
    return appointments.filter((appt) => {
      const doctor = appt.doctor || {};
      const doctorName = (doctor.name || "").toLowerCase();
      const specialization = (doctor.specialization || "").toLowerCase();
      const records = recordsMap[appt._id] || [];

      return (
        doctorName.includes(term) ||
        specialization.includes(term) ||
        records.some((r) => {
          const diag = (r.diagnosis || "").toLowerCase();
          const symp = (r.symptoms || "").toLowerCase();
          const meds = Array.isArray(r.prescriptions)
            ? r.prescriptions.some((p) =>
                (p.medicine || "").toLowerCase().includes(term)
              )
            : false;
          return diag.includes(term) || symp.includes(term) || meds;
        })
      );
    });
  }, [appointments, recordsMap, searchTerm]);

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  if (!patientId) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Please log in to view your medical history.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-[#fff] dark:bg-gray-800 rounded-xl p-6 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mt-1"></div>
              </div>
            </div>
            <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5 text-red-700 dark:text-red-300 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="bg-[#ffff] dark:bg-transparent h-full p-6 rounded-2xl border-2 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Medical Records
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {filteredAppointments.length} record
            {filteredAppointments.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search doctor, diagnosis, medicine..."
            className="flex-1 sm:flex-initial sm:w-100"
          />
          <ThemeToggle />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-16 col-span-full">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {searchTerm
              ? `No results for "${searchTerm}"`
              : "No medical records yet"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {searchTerm
              ? "Try a different search term."
              : "Records will appear after your completed visits."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAppointments.map((appt) => (
            <CompletedAppointmentCard
              key={appt._id}
              appointment={appt}
              records={recordsMap[appt._id] || []}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientMedical;
