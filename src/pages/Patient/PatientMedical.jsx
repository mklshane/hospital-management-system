import React, { useEffect, useState, useMemo } from "react";
import { FileText, AlertCircle } from "lucide-react";
import { api } from "@/lib/axiosHeader";
import ThemeToggle from "@/components/ThemeToggle";
import CompletedAppointmentCard from "@/components/Patient/CompletedAppointmentCard";
import SearchBar from "@/components/Common/SearchBar";
import EmptyState from "@/components/Common/EmptyState";

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
            className="bg-[#ffff] dark:bg-gray-800 rounded-xl p-6 animate-pulse"
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
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* This outer container now takes full height */}
      <div className="flex-1 flex flex-col overflow-hidden bg-ui-card border-2 rounded-2xl">
        {/* Fixed Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0 pb-3">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                Medical Records
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {filteredAppointments.length} record
                {filteredAppointments.length !== 1 && "s"}
              </p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search doctor, diagnosis, medicine..."
                className="flex-1 sm:flex-initial sm:min-w-80"
              />
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Scrollable Content with safe bottom padding */}
        <div className="flex-1 overflow-y-auto pb-8 md:pb-8">
          <div className="p-6">
            {filteredAppointments.length === 0 ? (
              <EmptyState
                title={
                  searchTerm ? "No records found" : "No Medical Records Yet"
                }
                description={
                  searchTerm
                    ? `No medical records match "${searchTerm}". Try a different search term.`
                    : "You haven't completed any appointments with medical records yet."
                }
                additionalInfo={
                  searchTerm
                    ? "Check your spelling or try searching by doctor name, diagnosis, or medication."
                    : "Your medical records will appear here after your completed visits with doctors."
                }
                icon="medical"
              />
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
        </div>
      </div>
    </div>
  );
};

export default PatientMedical;
