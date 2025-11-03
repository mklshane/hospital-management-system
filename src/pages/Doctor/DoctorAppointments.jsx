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
} from "lucide-react";
import { api } from "../../lib/axiosHeader";
import AppointmentCard from "../../components/Doctor/AppointmentCard";
import MedicalRecordModal from "../../components/Doctor/MedicalRecordModal";
import ThemeToggle from "../../components/ThemeToggle";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Unified sort state
  const [sortOrders, setSortOrders] = useState({
    pending: "desc",
    scheduled: "desc",
    completed: "desc",
    cancelled: "desc",
    rejected: "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  // Filter State
  const [selectedFilters, setSelectedFilters] = useState([
    "pending",
    "scheduled",
    "completed",
  ]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const statusOptions = [
    { key: "pending", label: "Pending", color: "yellow" },
    { key: "scheduled", label: "Scheduled", color: "blue" },
    { key: "completed", label: "Completed", color: "green" },
    { key: "cancelled", label: "Cancelled", color: "red" },
    { key: "rejected", label: "Rejected", color: "purple" },
  ];

  // Toggle filter selection (max 3)
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

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointment");
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Sort by date + time
  const sortByDate = (appointments, order) => {
    return [...appointments].sort((a, b) => {
      const dateA = new Date(
        `${a.appointment_date} ${a.appointment_time}`
      ).getTime();
      const dateB = new Date(
        `${b.appointment_date} ${b.appointment_time}`
      ).getTime();
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
  };

  // Toggle sort for a column
  const toggleSort = (column) => {
    setSortOrders((prev) => {
      const newOrder = prev[column] === "desc" ? "asc" : "desc";
      const updated = { ...prev, [column]: newOrder };

      // Sort the actual appointments state immediately to trigger re-render
      setAppointments((prevAppointments) => {
        const sorted = [...prevAppointments].sort((a, b) => {
          const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`);
          const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`);
          if (newOrder === "asc") return dateA - dateB;
          return dateB - dateA;
        });
        return sorted;
      });

      return updated;
    });
  };


  // Filtered + Searched + Sorted Appointments
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

  // Format date
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // Update Appointment Status
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

  if (loading)
    return (
      <p className="text-center py-10 text-foreground">
        Loading appointments...
      </p>
    );

  return (
    <div className="min-h-screen flex flex-col pb-10">
      <div className="flex-1 grid grid-cols-12 overflow-y-auto gap-5">
        {/* LEFT SECTION - APPOINTMENTS */}
        <div className="scrollbar col-span-9 bg-ui-card rounded-2xl p-6 flex flex-col overflow-y-auto max-h-[95vh] relative">
          {/* Alert Message */}
          {alertMessage && (
            <div className="absolute top-4 right-4 z-50 max-w-xs">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
                <span className="text-sm font-medium">{alertMessage}</span>
                <button
                  onClick={() => setAlertMessage("")}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold font-montserrat text-foreground">
              Appointments
            </h1>
            {/* Universal Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Search + Buttons */}
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search name, date, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-ui-muted border border-ui-border rounded-lg text-foreground placeholder-muted-foreground font-figtree focus:outline-none focus:ring-2 focus:ring-ui-ring"
              />
            </div>

            {/* Filter Dropdown */}
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
                    <p className="text-sm font-semibold text-foreground">
                      Select up to 3
                    </p>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
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
                              isChecked
                                ? "bg-blue border-blue"
                                : "border-ui-border"
                            }`}
                          >
                            {isChecked && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm text-foreground capitalize">
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

                  <div className="mt-3 pt-3 border-t border-ui-border">
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
              className="flex items-center justify-center gap-2 h-10 px-4 bg-blue hover:bg-blue-light text-white text-sm font-medium rounded-lg transition"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {/* Dynamic Columns */}
          <div className="grid grid-cols-3 gap-6">
            {selectedFilters.map((filterKey) => {
              const statusData = statusOptions.find((s) => s.key === filterKey);
              const list = filteredAppointments[filterKey] || [];
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
                        currentOrder === "asc"
                          ? "rotate-180 text-blue"
                          : "text-muted-foreground"
                      }`}
                    />
                  </h2>
                  <div className="space-y-4">
                    {list.map((appt) => (
                      <AppointmentCard
                        key={appt._id}
                        appt={appt}
                        onClick={setSelectedAppointment}
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
        <div className="col-span-3 bg-ui-card rounded-2xl p-6 flex flex-col h-full overflow-hidden">
          {/* Fixed header */}
          <header className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold font-montserrat text-foreground">
              Appointment Details
            </h2>
          </header>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto pr-2">
            {!selectedAppointment ? (
              <p className="text-center text-muted-foreground mt-8">
                Select an appointment to view details.
              </p>
            ) : (
              <>
                {/* ── PATIENT CARD ── */}
                <section className="bg-ui-muted/30 rounded-xl p-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue flex items-center justify-center text-lg font-semibold text-background">
                      {selectedAppointment.patient?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {selectedAppointment.patient?.name}
                      </h3>

                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedAppointment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : selectedAppointment.status === "Scheduled"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : selectedAppointment.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : selectedAppointment.status === "Cancelled"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                        }`}
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
                        {selectedAppointment.status}
                      </div>
                    </div>
                  </div>

                  {/* Patient meta grid */}
                  <dl className="grid grid-cols-[1fr_2fr] gap-x-2 gap-y-2 text-sm">
                    {selectedAppointment.patient?.age && (
                      <>
                        <dt className="text-muted-foreground">Age</dt>
                        <dd className="font-medium text-foreground">
                          {selectedAppointment.patient.age}
                        </dd>
                      </>
                    )}
                    {selectedAppointment.patient?.gender && (
                      <>
                        <dt className="text-muted-foreground">Gender</dt>
                        <dd className="font-medium text-foreground capitalize">
                          {selectedAppointment.patient.gender}
                        </dd>
                      </>
                    )}
                    {selectedAppointment.patient?.contact && (
                      <>
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd className="font-medium text-foreground">
                          {selectedAppointment.patient.contact}
                        </dd>
                      </>
                    )}
                    {selectedAppointment.patient?.email && (
                      <>
                        <dt className="text-muted-foreground">Email</dt>
                        <dd className="font-medium text-foreground break-all">
                          {selectedAppointment.patient.email}
                        </dd>
                      </>
                    )}
                    {selectedAppointment.patient?.address && (
                      <>
                        <dt className="text-muted-foreground">Address</dt>
                        <dd className="font-medium text-foreground">
                          {selectedAppointment.patient.address}
                        </dd>
                      </>
                    )}
                  </dl>
                </section>

                {/* ── SCHEDULE ── */}
                <section className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    Schedule
                  </h4>

                  {/* Compact meta + notes */}
                  <div className="bg-ui-muted rounded-lg p-4 space-y-3 text-sm mb-2">
                    {/* Meta */}
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <dt className="text-muted-foreground">ID</dt>
                      <dd className="font-mono font-medium text-foreground">
                        {selectedAppointment._id.slice(-6).toUpperCase()}
                      </dd>

                      <dt className="text-muted-foreground">Created</dt>
                      <dd className="font-medium text-foreground">
                        {formatDate(selectedAppointment.createdAt, "PPp")}
                      </dd>
                    </dl>

                    {/* Notes */}
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                        Patient Notes
                      </p>
                      <p className="text-foreground">
                        {selectedAppointment.notes || (
                          <span className="italic text-muted-foreground">
                            No notes provided.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                      
                  {/* Highlighted Date/Time Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 mb-4 border border-blue-200 dark:border-blue-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Date */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Date
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {formatDate(selectedAppointment.appointment_date, "PPP")}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Time
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {selectedAppointment.appointment_time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── ACTION BAR (sticky) ── */}
                <div className="sticky bottom-0 bg-ui-card pt-4 -mx-6 px-6 pb-6">
                  <div className="space-y-2">
                    {/* PENDING */}
                    {selectedAppointment.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(selectedAppointment._id, "Scheduled")
                          }
                          className="w-full bg-blue hover:bg-blue-dark text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept Appointment
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(selectedAppointment._id, "Rejected")
                          }
                          className="w-full border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject Appointment
                        </button>
                      </>
                    )}

                    {/* SCHEDULED */}
                    {selectedAppointment.status === "Scheduled" && (
                      <>
                        <button
                          onClick={() => setIsRecordModalOpen(true)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Add Medical Record
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(selectedAppointment._id, "Completed")
                          }
                          className="w-full border border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Completed
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Medical Record Modal (unchanged) */}
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
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
