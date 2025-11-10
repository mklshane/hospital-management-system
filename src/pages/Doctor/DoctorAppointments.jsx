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
  CheckCircle,
  XCircle,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import { api } from "../../lib/axiosHeader";
import AppointmentCard from "../../components/Doctor/AppointmentCard";
import MedicalRecordModal from "../../components/Doctor/MedicalRecordModal";
import CollapsibleSection from "../../components/Doctor/CollapsibleSection";
import AppointmentHistorySection from "../../components/Doctor/AppointmentHistorySection";
import MedicalRecordsSection from "../../components/Doctor/MedicalRecordsSection";
import AppointmentActionModal from "../../components/Doctor/AppointmentActionModal";
import ThemeToggle from "../../components/ThemeToggle";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [columnsRefreshing, setColumnsRefreshing] = useState(false); // ← NEW
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const [sortOrders, setSortOrders] = useState({
    pending: "asc",
    scheduled: "asc",
    completed: "desc",
    cancelled: "desc",
    rejected: "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([
    "pending",
    "scheduled",
    "completed",
  ]);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    appointment: null,
    action: null, 
  });

  const statusOptions = [
    { key: "pending", label: "Pending", color: "yellow" },
    { key: "scheduled", label: "Scheduled", color: "blue" },
    { key: "completed", label: "Completed", color: "green" },
    { key: "cancelled", label: "Cancelled", color: "red" },
    { key: "rejected", label: "Rejected", color: "purple" },
  ];

  const toggleFilter = (key) => {
    setSelectedFilters((prev) => {
      if (prev.includes(key)) {
        return prev.filter((f) => f !== key);
      }
      if (prev.length >= 3) {
        setAlertMessage("You can select a maximum of 3 statuses.");
        setTimeout(() => setAlertMessage(""), 4000);
        return prev;
      }
      return [...prev, key];
    });
  };

  const fetchAppointments = async () => {
    try {
      setColumnsRefreshing(true); // ← Trigger overlay
      setLoading(true);
      const res = await api.get("/appointment");
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setColumnsRefreshing(false), 300); // ← Smooth fade out
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ... [sortByDate, toggleSort, filteredAppointments, formatDate, updateStatus stay exactly the same] ...

  const sortByDate = (appointments, order) => {
    return [...appointments].sort((a, b) => {
      const parseAppointmentTime = (appt) => {
        const dateObj = new Date(appt.appointment_date);
        if (isNaN(dateObj.getTime())) return 0;

        const timeStr = appt.appointment_time?.trim();
        if (!timeStr) return dateObj.getTime();

        let hours, minutes;
        const upperTime = timeStr.toUpperCase();

        if (upperTime.includes('AM') || upperTime.includes('PM')) {
          const [time, period] = upperTime.split(' ');
          const [h, m = '0'] = time.split(':').map(Number);
          hours = h;
          minutes = m;

          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
        } else {
          const [h, m = '0'] = timeStr.split(':').map(Number);
          hours = h;
          minutes = m;
        }

        dateObj.setHours(hours, minutes, 0, 0);
        return dateObj.getTime();
      };

      const timeA = parseAppointmentTime(a);
      const timeB = parseAppointmentTime(b);

      if (timeA === 0 && timeB === 0) return 0;
      if (timeA === 0) return 1;
      if (timeB === 0) return -1;

      return order === "desc" ? timeB - timeA : timeA - timeB;
    });
  };

  const toggleSort = (column) => {
    setSortOrders(prev => ({
      ...prev,
      [column]: prev[column] === "desc" ? "asc" : "desc"
    }));
  };

  const filteredAppointments = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();
    const searched = lowerSearch
      ? appointments.filter((appt) => {
          const name = appt.patient?.name?.toLowerCase() ?? "";
          const date = appt.appointment_date?.toLowerCase() ?? "";
          const time = appt.appointment_time?.toLowerCase() ?? "";
          const notes = appt.notes?.toLowerCase() ?? "";
          return (
            name.includes(lowerSearch) ||
            date.includes(lowerSearch) ||
            time.includes(lowerSearch) ||
            notes.includes(lowerSearch)
          );
        })
      : appointments;

    const statusMap = {
      pending: searched.filter((a) => a.status === "Pending"),
      scheduled: searched.filter((a) => a.status === "Scheduled"),
      completed: searched.filter((a) => a.status === "Completed"),
      cancelled: searched.filter((a) => a.status === "Cancelled"),
      rejected: searched.filter((a) => a.status === "Rejected"),
    };

    const result = {};

    selectedFilters.forEach((key) => {
      const list = statusMap[key] || [];
      const order = sortOrders[key] || "desc";
      result[key] = sortByDate(list, order);
    });

    return result;
  }, [appointments, searchTerm, selectedFilters, sortOrders]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointment/${id}`, { status });
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === id ? { ...appt, status } : appt))
      );
      if (selectedAppointment?._id === id)
        setSelectedAppointment((prev) => ({ ...prev, status }));
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  // Initial full-screen loading (only on first mount)
  if (loading && appointments.length === 0) {
    return (
      <p className="text-center py-4 text-foreground text-sm">
        Loading appointments...
      </p>
    );
  }

  return (
    <div className="h-screen flex flex-col ">
      <div className="flex-1 grid grid-cols-12 mb-8 gap-3 overflow-hidden min-h-0">
        {/* LEFT SECTION - APPOINTMENTS */}
        <div className="scrollbar col-span-9 bg-ui-card rounded-xl p-4 flex flex-col overflow-hidden shadow-xs">
          {/* Alert Message */}
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
              Appointments
            </h1>
            <ThemeToggle />
          </div>

          {/* Search + Buttons */}
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search name, date, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-8 pl-7 pr-3 bg-ui-muted border border-ui-border rounded-lg text-xs text-foreground placeholder-muted-foreground font-figtree focus:outline-none focus:ring-1 focus:ring-ui-ring"
              />
            </div>

            {/* Filter Dropdown */}
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
                            className={`ml-auto text-xs font-medium ${
                              opt.color === "yellow"
                                ? "text-yellow-600"
                                : opt.color === "blue"
                                ? "text-blue-600"
                                : opt.color === "green"
                                ? "text-green-600"
                                : opt.color === "red"
                                ? "text-red-600"
                                : "text-purple-600"
                            }`}
                          >
                            {
                              appointments.filter(
                                (a) => a.status.toLowerCase() === opt.key
                              ).length
                            }
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-ui-border">
                    <button
                      onClick={() => {
                        setSelectedFilters([
                          "pending",
                          "scheduled",
                          "completed",
                        ]);
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
              onClick={fetchAppointments}
              disabled={loading}
              className="flex items-center justify-center gap-1 h-8 px-3 bg-blue hover:bg-blue-light text-white text-xs font-medium rounded-lg transition"
            >
              <RefreshCw
                className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {/* COLUMNS AREA WITH PROPER SCROLL + LOADING OVERLAY */}
          <div className="relative flex-1 min-h-0 overflow-hidden">
            {/* Loading Overlay - Covers only the columns */}
            {columnsRefreshing && (
              <div className="absolute inset-0 bg-ui-card/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 pointer-events-none rounded-xl">
                <RefreshCw className="w-7 h-7 text-blue animate-spin mb-2" />
                <p className="text-sm font-medium text-foreground">Refreshing columns...</p>
              </div>
            )}

            {/* Scrollable Grid Container */}
            <div className="h-full overflow-y-auto pr-1 scrollbar">
              <div className={`grid grid-cols-3 gap-3 pb-4 transition-opacity duration-300 ${
                columnsRefreshing ? "opacity-30" : "opacity-100"
              }`}>
                {selectedFilters.map((filterKey) => {
                  const statusData = statusOptions.find((s) => s.key === filterKey);
                  const list = filteredAppointments[filterKey] || [];
                  const currentOrder = sortOrders[filterKey] || "desc";

                  return (
                    <div key={filterKey} className="min-h-0 flex flex-col">
                      {/* Column Header */}
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

                      {/* Scrollable Cards */}
                      <div className="space-y-2 flex-1">
                        {list.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-8">
                            No {statusData.label.toLowerCase()} appointments
                          </p>
                        ) : (
                          list.map((appt) => (
                            <AppointmentCard
                              key={appt._id}
                              appt={appt}
                              onClick={setSelectedAppointment}
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
          {/* ... everything from header to modals stays exactly the same ... */}
          <header className="flex items-center justify-between mb-3 pb-2 border-b border-ui-border">
            <h2 className="text-base font-bold font-montserrat text-foreground">
              Appointment Details
            </h2>
          </header>

          <div className="scrollbar flex-1 min-h-0 overflow-y-auto pr-2 space-y-3 pb-16">
            {!selectedAppointment ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
                <div className="p-2 bg-ui-muted/50 rounded-full mb-2">
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-xs">
                  Select an appointment to view details.
                </p>
              </div>
            ) : (
              <>
                {/* SCHEDULE SECTION */}
                <section className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue flex items-center justify-center text-sm font-bold text-white">
                      {selectedAppointment.patient?.name
                        ?.split(" ")
                        .map((n) => n[0].toUpperCase())
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {selectedAppointment.patient?.name}
                      </h3>
                      <div
                        className={`w-20 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${
                          selectedAppointment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedAppointment.status === "Scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : selectedAppointment.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : selectedAppointment.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                        {selectedAppointment.status}
                      </div>
                    </div>
                  </div>

                  <div className="bg-ui-muted/50 rounded-lg p-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-blue" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Date
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            {formatDate(selectedAppointment.appointment_date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Time
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            {selectedAppointment.appointment_time}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1">
                      <p className="text-[10px] tracking-wider text-muted-foreground mb-1">
                        Patient Notes
                      </p>
                      <p className="text-xs text-foreground leading-relaxed">
                        {selectedAppointment.notes || (
                          <span className="italic text-muted-foreground">
                            No notes provided.
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                      <span>
                        ID: #{selectedAppointment._id.slice(-6).toUpperCase()}
                      </span>
                      <span>
                        {new Date(
                          selectedAppointment.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </section>

                <CollapsibleSection title="Patient Details" defaultOpen={false}>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedAppointment.patient?.age && (
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded bg-ui-muted flex items-center justify-center">
                          <span className="text-[10px] font-medium text-muted-foreground">
                            Age
                          </span>
                        </div>
                        <span className="font-medium text-foreground">
                          {selectedAppointment.patient.age} yrs
                        </span>
                      </div>
                    )}
                    {selectedAppointment.patient?.gender && (
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded bg-ui-muted flex items-center justify-center">
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {selectedAppointment.patient.gender === "male"
                              ? "M"
                              : "F"}
                          </span>
                        </div>
                        <span className="font-medium text-foreground capitalize">
                          {selectedAppointment.patient.gender}
                        </span>
                      </div>
                    )}
                    {selectedAppointment.patient?.contact && (
                      <div className="flex items-center gap-1 col-span-2">
                        <div className="w-6 h-6 rounded bg-ui-muted flex items-center justify-center">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <a
                          href={`tel:${selectedAppointment.patient.contact}`}
                          className="font-medium text-foreground hover:text-blue transition text-xs"
                        >
                          {selectedAppointment.patient.contact}
                        </a>
                      </div>
                    )}
                    {selectedAppointment.patient?.email && (
                      <div className="flex items-center gap-1 col-span-2">
                        <div className="w-6 h-6 rounded bg-ui-muted flex items-center justify-center">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <a
                          href={`mailto:${selectedAppointment.patient.email}`}
                          className="font-medium text-foreground hover:text-blue transition truncate text-xs"
                        >
                          {selectedAppointment.patient.email}
                        </a>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>

                <AppointmentHistorySection
                  key={selectedAppointment?.patient?._id}
                  patientId={selectedAppointment.patient?._id}
                  patientName={selectedAppointment.patient?.name}
                />

                <MedicalRecordsSection
                  patientId={selectedAppointment.patient?._id}
                  patientName={selectedAppointment.patient?.name}
                />
              </>
            )}
          </div>

          {selectedAppointment && (
            <div className="sticky bottom-0 -mx-3 mt-3 bg-gradient-to-t from-ui-card via-ui-card to-transparent pt-3">
              <div className="px-3 pb-3 space-y-2">
                {selectedAppointment.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        setModal({
                          isOpen: true,
                          appointment: selectedAppointment,
                          action: "accept",
                        })
                      }
                      className="w-full bg-blue hover:bg-blue-light text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1 text-xs shadow hover:shadow-md"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Accept Appointment
                    </button>
                    <button
                      onClick={() =>
                        setModal({
                          isOpen: true,
                          appointment: selectedAppointment,
                          action: "reject",
                        })
                      }
                      className="w-full border border-red-300 text-red-600 hover:bg-red-50 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1 text-xs"
                    >
                      <XCircle className="w-3 h-3" />
                      Reject Appointment
                    </button>
                  </>
                )}

                {selectedAppointment.status === "Scheduled" && (
                  <>
                    <button
                      onClick={() => setIsRecordModalOpen(true)}
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1 text-xs shadow hover:shadow-md"
                    >
                      <FileText className="w-3 h-3" />
                      Add Medical Record
                    </button>
                    <button
                      onClick={() =>
                        setModal({
                          isOpen: true,
                          appointment: selectedAppointment,
                          action: "complete",
                        })
                      }
                      className="w-full border border-green-300 text-green-600 hover:bg-green-50 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1 text-xs"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Mark as Completed
                    </button>
                  </>
                )}

                {(selectedAppointment.status === "Completed" ||
                  selectedAppointment.status === "Rejected" ||
                  selectedAppointment.status === "Cancelled") && (
                  <div className="text-center py-2">
                    <p className="text-xs text-muted-foreground">
                      This appointment is {selectedAppointment.status.toLowerCase()}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <MedicalRecordModal
            isOpen={isRecordModalOpen}
            onClose={() => setIsRecordModalOpen(false)}
            appointment={{
              _id: selectedAppointment?._id,
              patientName: selectedAppointment?.patient?.name,
              date: formatDate(selectedAppointment?.appointment_date),
              time: selectedAppointment?.appointment_time,
              notes: selectedAppointment?.notes,
            }}
            onRecordAdded={() => {
              fetchAppointments();
              setSelectedAppointment(null);
            }}
          />

          <AppointmentActionModal
            isOpen={modal.isOpen}
            onClose={() => setModal({ isOpen: false, appointment: null, action: null })}
            appointment={modal.appointment}
            actionType={modal.action}
            loading={loading}
            onConfirm={async () => {
              if (!modal.appointment || !modal.action) return;
              const statusMap = {
                accept: "Scheduled",
                reject: "Rejected",
                complete: "Completed",
              };
              await updateStatus(modal.appointment._id, statusMap[modal.action]);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;