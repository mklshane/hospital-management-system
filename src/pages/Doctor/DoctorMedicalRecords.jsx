import React, { useState, useEffect, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { api } from "@/lib/axiosHeader";
import MedicalRecordModal from "@/components/Doctor/MedicalRecords/MedicalRecordModal";

import { useApiData } from "@/hooks/useApiData";
import { useModal } from "@/hooks/useModal";

import { MedicalRecordsHeader } from "@/components/Doctor/MedicalRecords/MedicalRecordsHeader";
import { MedicalRecordsSearch } from "@/components/Doctor/MedicalRecords/MedicalRecordsSearch";
import { MedicalRecordsFilters } from "@/components/Doctor/MedicalRecords/MedicalRecordsFilters";
import { MedicalRecordsBoard } from "@/components/Doctor/MedicalRecords/MedicalRecordsBoard";
import { MedicalRecordsSidebar } from "@/components/Doctor/MedicalRecords/MedicalRecordsSidebar";

const statusOptions = [
  { key: "recent", label: "Recent (Last 30 days)", color: "blue" },
  { key: "older", label: "Older (30+ days)", color: "green" },
  { key: "archived", label: "Archived", color: "gray" },
];

const DoctorMedicalRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(["recent", "older"]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [sortOrders, setSortOrders] = useState({
    recent: "desc",
    older: "desc",
    archived: "desc",
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);

  // DoctorMedicalRecords.jsx
  const {
    data: records,
    loading,
    refetch,
    error,
  } = useApiData("/record", {
    entityName: "medical records",
    dataKey: "records", 
  });
  const { isOpen, open, close, selectedItem: editingRecord } = useModal();

  const [columnsRefreshing, setColumnsRefreshing] = useState(false);

  // Categorize records
  const categorizedRecords = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return records.map((record) => {
      const apptDate = new Date(record.appointment?.appointment_date);
      const _category = apptDate >= thirtyDaysAgo ? "recent" : "older";
      return { ...record, _category: record._category || _category };
    });
  }, [records]);

  // Fetch patient records
  useEffect(() => {
    if (selectedRecord?.patient?._id) {
      api.get(`/record/${selectedRecord.patient._id}`).then((res) => {
        setPatientRecords(res.data.records || []);
      });
    } else {
      setPatientRecords([]);
    }
  }, [selectedRecord]);

  // Filter & Search Logic
  const filteredRecords = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();
    const searched = lowerSearch
      ? categorizedRecords.filter((r) => {
          const fields = [
            r.patient?.name,
            r.diagnosis,
            r.symptoms,
            ...(r.prescriptions?.map((p) => p.medicine) || []),
          ];
          return fields.some((f) => f?.toLowerCase().includes(lowerSearch));
        })
      : categorizedRecords;

    const byCategory = {
      recent: searched.filter((r) => r._category === "recent"),
      older: searched.filter((r) => r._category === "older"),
      archived: searched.filter((r) => r._category === "archived"),
    };

    const result = {};
    selectedFilters.forEach((key) => {
      result[key] = [...(byCategory[key] || [])].sort((a, b) => {
        const dateA = new Date(a.appointment?.appointment_date || 0).getTime();
        const dateB = new Date(b.appointment?.appointment_date || 0).getTime();
        return sortOrders[key] === "desc" ? dateB - dateA : dateA - dateB;
      });
    });
    return result;
  }, [categorizedRecords, searchTerm, selectedFilters, sortOrders]);

  const statusCounts = statusOptions.reduce((acc, opt) => {
    acc[opt.key] = categorizedRecords.filter(
      (r) => r._category === opt.key
    ).length;
    return acc;
  }, {});

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No date";

  const toggleFilter = (key) => {
    setSelectedFilters((prev) => {
      if (prev.includes(key)) return prev.filter((f) => f !== key);
      if (prev.length >= 3) {
        setAlertMessage("You can select a maximum of 3 categories.");
        setTimeout(() => setAlertMessage(""), 4000);
        return prev;
      }
      return [...prev, key];
    });
  };

  const toggleSort = (col) => {
    setSortOrders((prev) => ({
      ...prev,
      [col]: prev[col] === "desc" ? "asc" : "desc",
    }));
  };

  const handleRefresh = async () => {
    setColumnsRefreshing(true);
    await refetch();
    setTimeout(() => setColumnsRefreshing(false), 300);
  };

  const openEditModal = (record) => open(record);
  const handleRecordUpdated = (updated) => {
    setSelectedRecord(updated);
    close();
  };

  const getModalAppointmentData = (record) => ({
    _id: record.appointment?._id || record._id,
    patientName: record.patient?.name || "Patient",
    date: formatDate(record.appointment?.appointment_date),
    time: record.appointment?.appointment_time || "",
    notes: record.appointment?.notes || "",
  });

  if (loading && records.length === 0) {
    return (
      <p className="text-center py-4 text-sm">Loading medical records...</p>
    );
  }
  console.log("useApiData result →", { loading, data: records });

  return (
    <div className="h-screen flex flex-col">
      {editingRecord && (
        <MedicalRecordModal
          isOpen={isOpen}
          onClose={close}
          appointment={getModalAppointmentData(editingRecord)}
          existingRecord={editingRecord}
          onRecordUpdated={handleRecordUpdated}
          refetchAppointments={refetch}
        />
      )}

      <div className="flex-1 grid grid-cols-12 gap-3 overflow-hidden min-h-0 pb-8">
        {/* LEFT BOARD */}
        <div className="scrollbar bg-ui-card border-2 rounded-xl pl-4 pt-4 pr-4 flex flex-col overflow-hidden shadow-xs col-span-9">
          <MedicalRecordsHeader />

          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <MedicalRecordsSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <MedicalRecordsFilters
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              statusOptions={statusOptions}
              statusCounts={statusCounts}
              toggleFilter={toggleFilter}
              alertMessage={alertMessage}
              setAlertMessage={setAlertMessage}
            />
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center justify-center gap-1 h-8 px-3 bg-blue hover:bg-blue-dark text-white text-xs font-medium rounded-lg transition"
            >
              <RefreshCw
                className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          <div className="relative flex-1 min-h-0 overflow-hidden">
            <div
              className={`h-full overflow-y-auto pr-1 scrollbar transition-opacity duration-500 ${
                columnsRefreshing
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <MedicalRecordsBoard
                filteredRecords={filteredRecords}
                selectedFilters={selectedFilters}
                statusOptions={statusOptions}
                sortOrders={sortOrders}
                toggleSort={toggleSort}
                onCardClick={setSelectedRecord}
                selectedRecord={selectedRecord}
                formatDate={formatDate}
                columnsRefreshing={columnsRefreshing}
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-ui-card rounded-xl flex flex-col overflow-hidden shadow-xs col-span-3 p-2 border-2">
          <MedicalRecordsSidebar
            selectedRecord={selectedRecord}
            patientRecords={patientRecords}
            formatDate={formatDate}
            onEdit={openEditModal}
            onRecordChange={setSelectedRecord}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorMedicalRecords;
