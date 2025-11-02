import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Funnel,
  ArrowUpDown,
  Calendar,
  Clock,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import { api } from "../../lib/axiosHeader";
import MedicalRecordCard from "../../components/MedicalRecordCard";
import ThemeToggle from "../../components/ThemeToggle";

const DoctorMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(["recent", "older"]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrders, setSortOrders] = useState({
    recent: "desc",
    older: "desc",
    archived: "desc",
  });

  const statusOptions = [
    { key: "recent", label: "Recent (Last 30 days)", color: "blue" },
    { key: "older", label: "Older (30+ days)", color: "green" },
    { key: "archived", label: "Archived", color: "gray" },
  ];

  const fetchRecords = async () => {
    try {
      setLoading(true);
      console.log("Fetching from: /record"); // ← Add
      const res = await api.get("/record");
      
      console.log("Raw API response:", res); // ← Add
      console.log("Response data:", res.data); // ← Add
      console.log("Records array:", res.data?.records); // ← Add

      if (!res.data?.records) {
        console.warn("No records in response");
        setRecords([]);
        return;
      }

      const allRecords = res.data.records;
      // ... rest of your code
    } catch (err) {
      console.error("Fetch error:", err); // ← Add
      console.error("Error response:", err.response?.data); // ← Add
      alert("Failed to load records. Check console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Fetch previous records for patient
  useEffect(() => {
    if (selectedRecord) {
      fetchPatientRecords(selectedRecord.patient._id);
    }
  }, [selectedRecord]);

  const fetchPatientRecords = async (patientId) => {
    try {
      const res = await api.get(`/record/${patientId}`);
      setPatientRecords(res.data.records || []);
    } catch (err) {
      console.error("Error fetching patient records:", err);
    }
  };

  const toggleFilter = (key) => {
    setSelectedFilters((prev) => {
      if (prev.includes(key)) {
        return prev.filter((f) => f !== key);
      }
      if (prev.length >= 3) {
        setAlertMessage("You can select a maximum of 3 categories.");
        setTimeout(() => setAlertMessage(""), 4000);
        return prev;
      }
      return [...prev, key];
    });
  };

  const sortByDate = (list, order) =>
    [...list].sort((a, b) => {
      const dateA = new Date(a.appointment.appointment_date).getTime();
      const dateB = new Date(b.appointment.appointment_date).getTime();
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });

  const toggleSort = (column) => {
    setSortOrders((prev) => ({
      ...prev,
      [column]: prev[column] === "desc" ? "asc" : "desc",
    }));
  };

  const filteredRecords = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();
    const searched = lowerSearch
      ? records.filter((r) => {
          const name = r.patient?.name?.toLowerCase() ?? "";
          const diagnosis = r.diagnosis?.toLowerCase() ?? "";
          const symptoms = r.symptoms?.toLowerCase() ?? "";
          const meds = r.prescriptions?.map((p) => p.medicine.toLowerCase()).join(" ") ?? "";
          return name.includes(lowerSearch) || diagnosis.includes(lowerSearch) || symptoms.includes(lowerSearch) || meds.includes(lowerSearch);
        })
      : records;

    const byCategory = {
      recent: searched.filter((r) => r._category === "recent"),
      older: searched.filter((r) => r._category === "older"),
      archived: searched.filter((r) => r._category === "archived"),
    };

    const result = {};
    selectedFilters.forEach((key) => {
      result[key] = sortByDate(byCategory[key] || [], sortOrders[key]);
    });
    return result;
  }, [records, searchTerm, selectedFilters, sortOrders]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const statusCounts = statusOptions.reduce((acc, opt) => {
    acc[opt.key] = records.filter((r) => r._category === opt.key).length;
    return acc;
  }, {});

  if (loading)
    return (
      <p className="text-center py-10 text-foreground">
        Loading medical records...
      </p>
    );

  return (
    <div className="min-h-screen flex flex-col pb-10">
      <div className="flex-1 grid grid-cols-12 overflow-y-auto gap-5">
        {/* LEFT SECTION */}
        <div className="scrollbar col-span-9 bg-ui-card rounded-2xl p-6 flex flex-col overflow-y-auto max-h-[95vh] relative">
          {/* Alert */}
          {alertMessage && (
            <div className="absolute top-4 right-4 z-50 max-w-xs">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
                <span className="text-sm font-medium">{alertMessage}</span>
                <button onClick={() => setAlertMessage("")} className="ml-2 text-red-600 hover:text-red-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold font-montserrat text-foreground">
              Medical Records
            </h1>
            <ThemeToggle />
          </div>

          {/* Search + Filter + Refresh */}
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patient, diagnosis, symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-ui-muted border border-ui-border rounded-lg text-foreground placeholder-muted-foreground font-figtree focus:outline-none focus:ring-2 focus:ring-ui-ring"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-center gap-2 h-10 px-4 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition"
              >
                <Funnel className="w-4 h-4" />
                Filter ({selectedFilters.length})
              </button>

              {isFilterOpen && (
                <div className="absolute top-full mt-2 left-0 w-56 bg-ui-card border border-ui-border rounded-lg shadow-lg z-50 p-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-foreground">Select up to 3</p>
                    <button onClick={() => setIsFilterOpen(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {statusOptions.map((opt) => {
                      const isChecked = selectedFilters.includes(opt.key);
                      return (
                        <label
                          key={opt.key}
                          onClick={() => toggleFilter(opt.key)}
                          className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-ui-muted transition"
                        >
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                              isChecked ? "bg-blue border-blue" : "border-ui-border"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm text-foreground capitalize">{opt.label}</span>
                          <span className={`ml-auto text-xs font-medium text-${opt.color}-600`}>
                            {statusCounts[opt.key]}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-ui-border">
                    <button
                      onClick={() => {
                        setSelectedFilters(["recent", "older"]);
                        setIsFilterOpen(false);
                      }}
                      className="w-full text-xs text-blue hover:underline"
                    >
                      Reset to default
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={fetchRecords}
              disabled={loading}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-blue hover:bg-blue-light text-white text-sm font-medium rounded-lg transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-3 gap-6">
            {selectedFilters.map((filterKey) => {
              const statusData = statusOptions.find((s) => s.key === filterKey);
              const list = filteredRecords[filterKey] || [];
              const currentOrder = sortOrders[filterKey] || "desc";

              return (
                <div key={filterKey}>
                  <h2
                    onClick={() => toggleSort(filterKey)}
                    className="flex items-center gap-1 text-lg font-semibold mb-3 text-foreground cursor-pointer hover:text-blue transition select-none"
                  >
                    {statusData.label} ({list.length})
                    <ArrowUpDown
                      className={`w-4 h-4 transition-all ${
                        currentOrder === "asc" ? "rotate-180 text-blue" : "text-muted-foreground"
                      }`}
                    />
                  </h2>
                  <div className="space-y-4">
                    {list.map((record) => (
                      <MedicalRecordCard
                        key={record._id}
                        record={record}
                        onClick={setSelectedRecord}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SECTION - DETAILS */}
        <div className="col-span-3 bg-ui-card rounded-2xl p-6 flex flex-col overflow-y-auto">
          <h2 className="text-xl font-bold font-montserrat text-foreground mb-6">
            Record Details
          </h2>

          {!selectedRecord ? (
            <p className="text-muted-foreground">Select a record to view details.</p>
          ) : (
            <>
              {/* Patient Info */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-semibold text-white">
                    {selectedRecord.patient?.name?.split(" ").map((n) => n[0]).join("") || "P"}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{selectedRecord.patient?.name}</h3>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1" />
                      {formatDate(selectedRecord.appointment?.appointment_date)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDate(selectedRecord.appointment?.appointment_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedRecord.appointment?.appointment_time}</span>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-2">Diagnosis</h4>
                <div className="bg-ui-muted rounded-lg p-3">
                  <p className="text-sm text-foreground">{selectedRecord.diagnosis}</p>
                </div>
              </div>

              {/* Symptoms */}
              {selectedRecord.symptoms && (
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-2">Symptoms</h4>
                  <div className="bg-ui-muted rounded-lg p-3">
                    <p className="text-sm text-foreground">{selectedRecord.symptoms}</p>
                  </div>
                </div>
              )}

              {/* Prescriptions */}
              {selectedRecord.prescriptions?.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-2">
                    Prescriptions ({selectedRecord.prescriptions.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedRecord.prescriptions.map((p, i) => (
                      <div key={i} className="bg-ui-muted p-3 rounded-lg text-sm">
                        <div className="font-medium">{p.medicine}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.dosage} • {p.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous Records Dropdown */}
              {patientRecords.length > 1 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-2">Previous Records</h4>
                  <div className="relative">
                    <select
                      className="w-full p-3 bg-ui-muted border border-ui-border rounded-lg text-sm text-foreground appearance-none pr-10"
                      onChange={(e) => {
                        const rec = patientRecords.find((r) => r._id === e.target.value);
                        if (rec) setSelectedRecord(rec);
                      }}
                      value={selectedRecord._id}
                    >
                      {patientRecords.map((r) => (
                        <option key={r._id} value={r._id}>
                          {formatDate(r.appointment.appointment_date)} - {r.diagnosis}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Action */}
              <button
                onClick={() => window.print()}
                className="mt-auto w-full bg-blue hover:bg-blue-dark text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Print Record
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorMedicalRecords;