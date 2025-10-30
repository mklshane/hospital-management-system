import React, { useState, useEffect, useMemo } from 'react';
import { Moon, Sun, Search, RefreshCw, Funnel, ArrowUpDown, Calendar, Clock, X, Check } from "lucide-react";
import { api } from "../../lib/axiosHeader";
import AppointmentCard from "../../components/AppointmentCard";
import MedicalRecordModal from '../../components/MedicalRecordModal';

const DoctorAppointments = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [sortOrderPending, setSortOrderPending] = useState('desc');
  const [sortOrderScheduled, setSortOrderScheduled] = useState('desc');
  const [sortOrderCompleted, setSortOrderCompleted] = useState('desc');
  const [sortOrderCancelled, setSortOrderCancelled] = useState('desc');
  const [sortOrderRejected, setSortOrderRejected] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // Filter State
  const [selectedFilters, setSelectedFilters] = useState(['pending', 'scheduled', 'completed']); // Default: show first 3
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const statusOptions = [
    { key: 'pending', label: 'Pending', color: 'yellow' },
    { key: 'scheduled', label: 'Scheduled', color: 'blue' },
    { key: 'completed', label: 'Completed', color: 'green' },
    { key: 'cancelled', label: 'Cancelled', color: 'red' },
    { key: 'rejected', label: 'Rejected', color: 'purple' },
  ];

  // Toggle filter selection
  const toggleFilter = (key) => {
    setSelectedFilters(prev => {
      if (prev.includes(key)) {
        return prev.filter(f => f !== key);
      }
      if (prev.length >= 3) {
        setAlertMessage("You can select a maximum of 3 statuses.");
        setTimeout(() => setAlertMessage(''), 4000); 
        return prev;
      }
      return [...prev, key];
    });
  };

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

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

  // Helper for sorting date
  const sortByDate = (appointments, order) => {
    return [...appointments].sort((a, b) => {
      const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`).getTime();
      const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`).getTime();
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };

  const toggleSort = (column) => {
    if (column === 'pending') setSortOrderPending(prev => prev === 'desc' ? 'asc' : 'desc');
    if (column === 'scheduled') setSortOrderScheduled(prev => prev === 'desc' ? 'asc' : 'desc');
    if (column === 'completed') setSortOrderCompleted(prev => prev === 'desc' ? 'asc' : 'desc');
    if (column === 'cancelled') setSortOrderCancelled(prev => prev === 'desc' ? 'asc' : 'desc');
    if (column === 'rejected') setSortOrderRejected(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const filteredAppointments = useMemo(() => {
    // 1. Global search across name, date, notes
    const lowerSearch = searchTerm.toLowerCase().trim();
    const searched = lowerSearch
      ? appointments.filter(appt => {
          const name = appt.patient?.name?.toLowerCase() ?? '';
          const date = appt.appointment_date?.toLowerCase() ?? '';
          const time = appt.appointment_time?.toLowerCase() ?? '';
          const notes = appt.notes?.toLowerCase() ?? '';
          return (
            name.includes(lowerSearch) ||
            date.includes(lowerSearch) ||
            time.includes(lowerSearch) ||
            notes.includes(lowerSearch)
          );
        })
      : appointments;

    // 2. Split into status buckets (same as before)
    const statusMap = {
      pending:    searched.filter(a => a.status === "Pending"),
      scheduled:  searched.filter(a => a.status === "Scheduled"),
      completed:  searched.filter(a => a.status === "Completed"),
      cancelled:  searched.filter(a => a.status === "Cancelled"),
      rejected:   searched.filter(a => a.status === "Rejected"),
    };

    const result = {};

    selectedFilters.forEach(key => {
      const list = statusMap[key] || [];
      let order = 'desc';
      if (key === 'pending')    order = sortOrderPending;
      if (key === 'scheduled')  order = sortOrderScheduled;
      if (key === 'completed')  order = sortOrderCompleted;
      if (key === 'cancelled')  order = sortOrderCancelled;
      if (key === 'rejected')   order = sortOrderRejected;

      result[key] = sortByDate(list, order);
    });

    return result;
  }, [
    appointments,
    searchTerm,               
    selectedFilters,
    sortOrderPending,
    sortOrderScheduled,
    sortOrderCompleted,
    sortOrderCancelled,
    sortOrderRejected,
  ]);

  // Helper for date/time formatting
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
      setAppointments(prev =>
        prev.map(appt => (appt._id === id ? { ...appt, status } : appt))
      );
      if (selectedAppointment?._id === id)
        setSelectedAppointment(prev => ({ ...prev, status }));
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <p className="text-center py-10 text-foreground">Loading appointments...</p>;

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
                  onClick={() => setAlertMessage('')}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold font-montserrat text-foreground">Appointments</h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-blue-light/20 rounded-full hover:bg-blue-light/40 transition"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
            </button>
          </div>

          {/* Search + Buttons */}
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search name, date, notes..."
                value={searchTerm}                   
                onChange={e => setSearchTerm(e.target.value)}
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

              {/* Dropdown */}
              {isFilterOpen && (
                <div className="absolute top-full mt-2 left-0 w-56 bg-ui-card border border-ui-border rounded-lg shadow-lg z-50 p-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-foreground">Select up to 3</p>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    {[
                      { key: 'pending',    label: 'Pending',    color: 'yellow' },
                      { key: 'scheduled',  label: 'Scheduled',  color: 'blue' },
                      { key: 'completed',  label: 'Completed',  color: 'green' },
                      { key: 'cancelled',  label: 'Cancelled',  color: 'red' },
                      { key: 'rejected',   label: 'Rejected',   color: 'purple' },
                    ].map(opt => {
                      const isChecked = selectedFilters.includes(opt.key);
                      return (
                        <label
                          key={opt.key}
                          onClick={() => toggleFilter(opt.key)}   // <-- click to check/uncheck
                          className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-ui-muted transition"
                        >
                          {/* Custom checkbox */}
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                              isChecked ? 'bg-blue border-blue' : 'border-ui-border'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 text-white" />}
                          </div>

                          <span className="text-sm text-foreground capitalize">{opt.label}</span>

                          {/* Count */}
                          <span
                            className={`ml-auto text-xs font-medium ${
                              opt.color === 'yellow' ? 'text-yellow-600' :
                              opt.color === 'blue'   ? 'text-blue-600'   :
                              opt.color === 'green'  ? 'text-green-600'  :
                              opt.color === 'red'    ? 'text-red-600'    :
                                                      'text-purple-600'
                            }`}
                          >
                            {appointments.filter(a => a.status.toLowerCase() === opt.key).length}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Reset */}
                  <div className="mt-3 pt-3 border-t border-ui-border">
                    <button
                      onClick={() => {
                        setSelectedFilters(['pending', 'scheduled', 'completed']);
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
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Dynamic Columns based on selectedFilters */}
          <div className="grid grid-cols-3 gap-6">
            {selectedFilters.map(filterKey => {
              const statusData = statusOptions.find(s => s.key === filterKey);
              const list = filteredAppointments[filterKey] || [];
              let currentOrder = 'desc';
                if (filterKey === 'pending') currentOrder = sortOrderPending;
                if (filterKey === 'scheduled') currentOrder = sortOrderScheduled;
                if (filterKey === 'completed') currentOrder = sortOrderCompleted;
                if (filterKey === 'cancelled') currentOrder = sortOrderCancelled;
                if (filterKey === 'rejected') currentOrder = sortOrderRejected;

              return (
                <div key={filterKey}>
                  <h2
                    onClick={() => toggleSort(filterKey)}
                    className="flex items-center gap-1 text-lg font-semibold mb-3 text-foreground cursor-pointer hover:text-blue transition select-none"
                  >
                    {statusData.label} ({list.length})
                    <ArrowUpDown
                      className={`w-4 h-4 transition-transform ${
                        currentOrder === 'asc' ? 'rotate-180' : ''
                      }`}
                    />
                  </h2>
                  <div className="space-y-4">
                    {list.map(appt => (
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
        <div className="col-span-3 bg-ui-card rounded-2xl p-8 flex flex-col overflow-y-auto p-6">
          <h2 className="text-xl font-bold font-montserrat text-foreground mb-6">Appointment Details</h2>

          {!selectedAppointment ? (
            <p className="text-muted-foreground">Select an appointment to view details.</p>
          ) : (
            <>
              {/* Patient Info */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue flex items-center justify-center text-lg font-semibold text-background">
                    {selectedAppointment.patient?.name?.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{selectedAppointment.patient?.name}</h3>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      selectedAppointment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : selectedAppointment.status === "Scheduled"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        : selectedAppointment.status === "Completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : selectedAppointment.status === "Cancelled"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    }`}>
                      ● {selectedAppointment.status}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground"><Calendar className="w-4 h-4"/></span>
                    <span className="text-foreground">{formatDate(selectedAppointment.appointment_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground"><Clock className="w-4 h-4" /></span>
                    <span className="text-foreground">{selectedAppointment.appointment_time}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="border-ui-border mb-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-foreground mb-2">Patient Notes</h4>
                  <div className="bg-ui-muted rounded-lg p-3">
                    <p className="text-sm text-foreground">{selectedAppointment.notes || "No notes provided."}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Appointment ID:</span>
                    <span className="text-foreground font-medium">{selectedAppointment._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="text-foreground">{formatDate(selectedAppointment.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {selectedAppointment.status === "Pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(selectedAppointment._id, "Scheduled")}
                      className="w-full bg-blue hover:bg-blue-dark text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      Accept Appointment
                    </button>
                    <button
                      onClick={() => updateStatus(selectedAppointment._id, "Rejected")}
                      className="w-full border border-red-300 text-red-600 hover:bg-red-50 py-3 rounded-lg font-semibold transition-colors dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Reject Appointment
                    </button>
                  </>
                )}

                {selectedAppointment.status === "Scheduled" && (
                  <>
                    <button
                      onClick={() => setIsRecordModalOpen(true)}
                      className="w-full bg-blue hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      Add Medical Record
                    </button>
                    <button
                      onClick={() => updateStatus(selectedAppointment._id, "Completed")}
                      className="w-full border border-green-300 text-green-600 hover:bg-green-50 py-3 rounded-lg font-semibold transition-colors dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                    >
                      Complete Appointment
                    </button>      
                  </>
                )}
              </div>
              
              {/* Medical Record Modal */}
              <MedicalRecordModal
                isOpen={isRecordModalOpen}
                onClose={() => setIsRecordModalOpen(false)}
                appointment={{
                  _id: selectedAppointment._id,
                  patientName: selectedAppointment.patient?.name,
                  date: formatDate(selectedAppointment.appointment_date),
                  time: selectedAppointment.appointment_time,
                  notes: selectedAppointment.notes,
                }}
                onRecordAdded={() => {
                  fetchAppointments();
                  setSelectedAppointment(null);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;