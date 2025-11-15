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
  FileText,
  Stethoscope,
  Activity,
  Pill,
  Printer,
} from "lucide-react";
import { api } from "../../lib/axiosHeader";
import MedicalRecordCard from "../../components/Doctor/MedicalRecordCard";
import ThemeToggle from "../../components/ThemeToggle";
import BoardSkeletonColumn from "@/components/Common/BoardSkeletonColumn";

const Column = ({
  filterKey,
  statusData,
  list,
  currentOrder,
  toggleSort,
  children,
}) => (
  <div className="relative min-h-0 flex flex-col bg-ui-surface/30 rounded-lg p-2 border border-ui-border/20">
    <div
      className={`absolute top-0 left-0 right-0 h-0.5 ${
        statusData.color === "blue"
          ? "bg-blue-500"
          : statusData.color === "green"
          ? "bg-green-500"
          : "bg-gray-400"
      }`}
    />
    <h2
      onClick={() => toggleSort(filterKey)}
      className="flex items-center gap-1 text-sm font-semibold mb-2 text-foreground cursor-pointer hover:text-blue transition select-none sticky top-0 bg-ui-card z-10 py-1 px-1 rounded"
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
    <div className="space-y-2 flex-1 overflow-y-auto pr-1">{children}</div>
  </div>
);

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
    } else {
      setPatientRecords([]);
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
      if (prev.includes(key)) return prev.filter((f) => f !== key);
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
        {/* LEFT BOARD */}
        <div className="scrollbar bg-ui-card border-2 rounded-xl pl-4 pt-4 pr-4 flex flex-col overflow-hidden shadow-xs col-span-9">
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

          <div className="flex justify-between items-start mb-4">
            <h1 className="text-lg font-bold font-montserrat text-foreground">
              Medical Records
            </h1>
            <ThemeToggle />
          </div>

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
              className="flex items-center justify-center gap-1 h-8 px-3 bg-blue hover:bg-blue-dark text-white text-xs font-medium rounded-lg transition"
            >
              <RefreshCw
                className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          <div className="relative flex-1 min-h-0 overflow-hidden">
            {/* SKELETON */}
            {columnsRefreshing && (
              <div className="h-full overflow-y-auto pr-1 scrollbar">
                <div className="grid grid-cols-3 gap-4 pb-4">
                  {selectedFilters.map((filterKey) => {
                    const statusData = statusOptions.find(
                      (s) => s.key === filterKey
                    );
                    return (
                      <BoardSkeletonColumn
                        key={filterKey}
                        label={statusData.label}
                        color={statusData.color}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* REAL CONTENT */}
            <div
              className={`h-full overflow-y-auto pr-1 scrollbar transition-opacity duration-500 ${
                columnsRefreshing
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <div className="grid grid-cols-3 gap-4 pb-4">
                {selectedFilters.map((filterKey) => {
                  const statusData = statusOptions.find(
                    (s) => s.key === filterKey
                  );
                  const list = filteredRecords[filterKey] || [];
                  const currentOrder = sortOrders[filterKey] || "desc";

                  return (
                    <Column
                      key={filterKey}
                      filterKey={filterKey}
                      statusData={statusData}
                      list={list}
                      currentOrder={currentOrder}
                      toggleSort={toggleSort}
                    >
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
                            isSelected={selectedRecord?._id === record._id}
                          />
                        ))
                      )}
                    </Column>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-ui-card rounded-xl flex flex-col overflow-hidden shadow-xs col-span-3 p-2 border-2">
          {selectedRecord ? (
            <>
              <div className="sticky top-0 bg-ui-card z-10 border-b border-ui-border px-3 py-2.5">
                <h2 className="text-base font-bold font-montserrat text-foreground leading-tight">
                  Record Details
                </h2>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto scrollbar px-3 pt-3 pb-24 space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {selectedRecord.patient?.name
                      ?.split(" ")
                      .map((n) => n[0].toUpperCase())
                      .join("")
                      .slice(0, 2) || "P"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground truncate text-sm">
                      {selectedRecord.patient?.name}
                    </h3>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {formatDate(selectedRecord.appointment?.appointment_date)}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pl-1">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-blue" />
                    <p className="text-[10px] tracking-wider text-muted-foreground">
                      Diagnosis
                    </p>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed pl-6">
                    {selectedRecord.diagnosis || (
                      <span className="italic text-muted-foreground">
                        No diagnosis recorded.
                      </span>
                    )}
                  </p>
                </div>

                {selectedRecord.symptoms && (
                  <div className="space-y-1 pl-1">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue" />
                      <p className="text-[10px] tracking-wider text-muted-foreground">
                        Symptoms
                      </p>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed pl-6">
                      {selectedRecord.symptoms}
                    </p>
                  </div>
                )}

                {selectedRecord.prescriptions?.length > 0 && (
                  <div className="space-y-1 pl-1">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-blue" />
                      <p className="text-[10px] tracking-wider text-muted-foreground">
                        Prescriptions ({selectedRecord.prescriptions.length})
                      </p>
                    </div>
                    <div className="space-y-2 pl-6">
                      {selectedRecord.prescriptions.map((p, i) => (
                        <div
                          key={i}
                          className="bg-ui-muted/50 p-2 rounded-lg text-xs"
                        >
                          <div className="font-medium text-foreground">
                            {p.medicine}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {p.dosage} • {p.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {patientRecords.length > 1 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="text-[10px] tracking-wider text-muted-foreground">
                        Previous Records
                      </p>
                    </div>
                    <div className="relative pl-6">
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
                        {patientRecords
                          .sort(
                            (a, b) =>
                              new Date(b.appointment.appointment_date) -
                              new Date(a.appointment.appointment_date)
                          )
                          .map((r) => (
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
              </div>

              <div className="sticky bottom-0 bg-ui-card px-3 pb-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="w-full bg-blue hover:bg-blue-dark text-white py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print Record
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center px-3">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-ui-muted/50 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No record selected
                </p>
                <p className="text-xs text-muted-foreground">
                  Click on any record card to view details.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorMedicalRecords;
