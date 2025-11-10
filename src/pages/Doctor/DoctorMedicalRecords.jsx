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
import MedicalRecordCard from "../../components/Doctor/MedicalRecordCard";
import ThemeToggle from "../../components/ThemeToggle";

const DoctorMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnsRefreshing, setColumnsRefreshing] = useState(false);
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
      setColumnsRefreshing(true);
      setLoading(true);
      const res = await api.get("/record");

      if (!res.data?.records || res.data.records.length === 0) {
        setRecords([]);
        return;
      }

      const allRecords = res.data.records.map((record) => {
        const apptDate = new Date(record.appointment?.appointment_date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        let _category = "archived";
        if (apptDate >= thirtyDaysAgo) _category = "recent";
        else _category = "older";

        return { ...record, _category };
      });

      setRecords(allRecords);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to load records. Check console.");
    } finally {
      setLoading(false);
      setTimeout(() => setColumnsRefreshing(false), 300);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

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
          const meds =
            r.prescriptions?.map((p) => p.medicine.toLowerCase()).join(" ") ??
            "";
          return (
            name.includes(lowerSearch) ||
            diagnosis.includes(lowerSearch) ||
            symptoms.includes(lowerSearch) ||
            meds.includes(lowerSearch)
          );
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

  if (loading && records.length === 0) {
    return (
      <p className="text-center py-4 text-foreground text-sm">
        Loading medical records...
      </p>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 grid grid-cols-12 gap-3 mb-8 overflow-hidden min-h-0">
        {/* LEFT SECTION */}
        <div className="scrollbar col-span-9 bg-ui-card rounded-xl p-4 flex flex-col overflow-hidden shadow-xs">
          {/* Alert */}
          {alertMessage && (
            <div className="absolute top-3 right-3 z-50 max-w-xs">
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg shadow flex items-center gap-2 text-xs">
                <span className="font-medium">{alertMessage}</span>
                <button
                  onClick={() => setAlertMessage("")}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-lg font-bold font-montserrat text-foreground">
              Medical Records
            </h1>
            <ThemeToggle />
          </div>

          {/* Search + Filter + Refresh */}
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patient, diagnosis, symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-8 pl-7 pr-3 bg-ui-muted border border-ui-border rounded-lg text-xs text-foreground placeholder-muted-foreground font-figtree focus:outline-none focus:ring-1 focus:ring-ui-ring"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-center gap-1 h-8 px-3 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted transition"
              >
                <Funnel className="w-3 h-3" />
                Filter ({selectedFilters.length})
              </button>

              {isFilterOpen && (
                <div className="absolute top-full mt-1 left-0 w-48 bg-ui-card border border-ui-border rounded-lg shadow z-50 p-2">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-semibold text-foreground">
                      Select up to 3
                    </p>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {statusOptions.map((opt) => {
                      const isChecked = selectedFilters.includes(opt.key);
                      return (
                        <label
                          key={opt.key}
                          onClick={() => toggleFilter(opt.key)}
                          className="flex items-center gap-2 p-1.5 rounded cursor-pointer hover:bg-ui-muted transition text-xs"
                        >
                          <div
                            className={`w-3 h-3 rounded border flex items-center justify-center transition ${
                              isChecked
                                ? "bg-blue border-blue"
                                : "border-ui-border"
                            }`}
                          >
                            {isChecked && (
                              <Check className="w-2 h-2 text-white" />
                            )}
                          </div>
                          <span className="text-foreground capitalize">
                            {opt.label}
                          </span>
                          <span
                            className={`ml-auto text-xs font-medium text-${opt.color}-600`}
                          >
                            {statusCounts[opt.key]}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="mt-2 pt-2 border-t border-ui-border">
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
              className="flex items-center justify-center gap-1 h-8 px-3 bg-blue hover:bg-blue-light text-white text-xs font-medium rounded-lg transition"
            >
              <RefreshCw
                className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {/* COLUMNS WITH DASHBOARD-STYLE SKELETON CARDS */}
          <div className="relative flex-1 min-h-0 overflow-hidden">
            {/* SKELETON LOADING - DASHBOARD STYLE */}
            {columnsRefreshing && (
              <div className="h-full overflow-y-auto pr-1 scrollbar">
                <div className="grid grid-cols-3 gap-3 pb-4">
                  {selectedFilters.map((filterKey) => {
                    const statusData = statusOptions.find((s) => s.key === filterKey);

                    return (
                      <div key={filterKey} className="min-h-0 flex flex-col">
                        <h2 className="flex items-center gap-1 text-sm font-semibold mb-2 text-foreground sticky top-0 bg-ui-card z-10 py-1">
                          {statusData.label} ({Math.floor(Math.random() * 6) + 1})
                          <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                        </h2>

                        <div className="space-y-2">
                          {[...Array(Math.floor(Math.random() * 4) + 3)].map((_, i) => (
                            <div
                              key={i}
                              className="bg-ui-muted/50 backdrop-blur-sm border border-ui-border/30 rounded-xl p-3 animate-pulse"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-ui-muted/70 animate-pulse" />
                                <div className="flex-1 space-y-2">
                                  <div className="h-4 bg-ui-muted/60 rounded w-36 animate-pulse" />
                                  <div className="h-3 bg-ui-muted/50 rounded w-24 animate-pulse" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="h-3 bg-ui-muted/50 rounded w-full animate-pulse" />
                                <div className="h-3 bg-ui-muted/50 rounded w-32 animate-pulse" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* REAL CONTENT - SMOOTH FADE IN */}
            <div
              className={`h-full overflow-y-auto pr-1 scrollbar transition-opacity duration-500 ${
                columnsRefreshing ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="grid grid-cols-3 gap-3 pb-4">
                {selectedFilters.map((filterKey) => {
                  const statusData = statusOptions.find((s) => s.key === filterKey);
                  const list = filteredRecords[filterKey] || [];
                  const currentOrder = sortOrders[filterKey] || "desc";

                  return (
                    <div key={filterKey} className="min-h-0 flex flex-col">
                      <h2
                        onClick={() => toggleSort(filterKey)}
                        className="flex items-center gap-1 text-sm font-semibold mb-2 text-foreground cursor-pointer hover:text-blue transition select-none sticky top-0 bg-ui-card z-10 py-1"
                      >
                        {statusData.label} ({list.length})
                        <ArrowUpDown
                          className={`w-3 h-3 transition-all ${
                            currentOrder === "asc"
                              ? "rotate-180 text-blue"
                              : "text-muted-foreground"
                          }`}
                        />
                      </h2>

                      <div className="space-y-2 flex-1">
                        {list.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-8">
                            No {statusData.label.toLowerCase()} records
                          </p>
                        ) : (
                          list.map((record) => (
                            <MedicalRecordCard
                              key={record._id}
                              record={record}
                              onClick={setSelectedRecord}
                              formatDate={formatDate}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - DETAILS (unchanged) */}
        <div className="col-span-3 bg-ui-card rounded-xl p-3 flex flex-col overflow-hidden shadow-xs">
          <h2 className="text-base font-bold font-montserrat text-foreground mb-4">
            Record Details
          </h2>

          {!selectedRecord ? (
            <p className="text-muted-foreground text-sm">
              Select a record to view details.
            </p>
          ) : (
            <>
              {/* Patient Info */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold text-white">
                    {selectedRecord.patient?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "P"}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">
                      {selectedRecord.patient?.name}
                    </h3>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <span className="w-1 h-1 rounded-full bg-blue-500 mr-1" />
                      {formatDate(selectedRecord.appointment?.appointment_date)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span>
                      {formatDate(selectedRecord.appointment?.appointment_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span>{selectedRecord.appointment?.appointment_time}</span>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mb-4">
                <h4 className="font-semibold text-foreground text-sm mb-1">
                  Diagnosis
                </h4>
                <div className="bg-ui-muted rounded-lg p-2">
                  <p className="text-xs text-foreground">
                    {selectedRecord.diagnosis}
                  </p>
                </div>
              </div>

              {/* Symptoms */}
              {selectedRecord.symptoms && (
                <div className="mb-4">
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    Symptoms
                  </h4>
                  <div className="bg-ui-muted rounded-lg p-2">
                    <p className="text-xs text-foreground">
                      {selectedRecord.symptoms}
                    </p>
                  </div>
                </div>
              )}

              {/* Prescriptions */}
              {selectedRecord.prescriptions?.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    Prescriptions ({selectedRecord.prescriptions.length})
                  </h4>
                  <div className="space-y-1">
                    {selectedRecord.prescriptions.map((p, i) => (
                      <div
                        key={i}
                        className="bg-ui-muted p-2 rounded-lg text-xs"
                      >
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
                <div className="mb-4">
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    Previous Records
                  </h4>
                  <div className="relative">
                    <select
                      className="w-full p-2 bg-ui-muted border border-ui-border rounded-lg text-xs text-foreground appearance-none pr-8"
                      onChange={(e) => {
                        const rec = patientRecords.find(
                          (r) => r._id === e.target.value
                        );
                        if (rec) setSelectedRecord(rec);
                      }}
                      value={selectedRecord._id}
                    >
                      {patientRecords.map((r) => (
                        <option key={r._id} value={r._id}>
                          {formatDate(r.appointment.appointment_date)} -{" "}
                          {r.diagnosis}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Action */}
              <button
                onClick={() => window.print()}
                className="mt-auto w-full bg-blue hover:bg-blue-dark text-white py-2 rounded-lg font-semibold text-sm transition-colors"
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