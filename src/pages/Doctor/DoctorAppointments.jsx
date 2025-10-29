import React, { useState, useEffect, useMemo } from 'react';
import { Moon, Sun, Search, RefreshCw, Funnel, ArrowUpDown, Calendar, Clock } from "lucide-react";
import { api } from "../../lib/axiosHeader";
import AppointmentCard from "../../components/AppointmentCard";
import MedicalRecordModal from '../../components/MedicalRecordModal';

const DoctorAppointments = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [sortOrders, setSortOrders] = useState({
      pending: 'desc',
      scheduled: 'desc',
      completed: 'desc',
      cancelled: 'desc',
      rejected: 'desc',
    });
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    
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
        const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`);
        const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`);
        return order === 'desc' ? dateB - dateA : dateA - dateB;
      });
    };

    const toggleSort = (column) => {
      setSortOrders(prev => {
        const newOrder = prev[column] === "desc" ? "asc" : "desc";
        return { ...prev, [column]: newOrder };
      });
      setRefreshKey((k) => k + 1);
    };

    // Categorize Appointments
    const pending = useMemo(() => {
      const list = appointments.filter((a) => a.status === "Pending");
      return sortByDate(list, sortOrders.pending);
    }, [appointments, sortOrders.pending]);

    const scheduled = useMemo(() => {
      const list = appointments.filter((a) => a.status === "Scheduled");
      return sortByDate(list, sortOrders.scheduled);
    }, [appointments, sortOrders.scheduled]);

    const completed = useMemo(() => {
      const list = appointments.filter((a) => a.status === "Completed");
      return sortByDate(list, sortOrders.completed);
    }, [appointments, sortOrders.completed]);

    const cancelled = useMemo(() => {
      const list = appointments.filter(a => a.status === "Cancelled");
      return sortByDate(list, sortOrders.cancelled || 'desc');
    }, [appointments, sortOrders.cancelled]);

    const rejected = useMemo(() => {
      const list = appointments.filter(a => a.status === "Rejected");
      return sortByDate(list, sortOrders.rejected || 'desc');
    }, [appointments, sortOrders.rejected]);

    useEffect(() => {
      setAppointments((prev) => [...prev]);
    }, [appointments.length]);

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
        <div className="col-span-9 bg-ui-card rounded-2xl p-6 flex flex-col overflow-y-auto max-h-[95vh]">
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
                className="w-full h-10 pl-10 pr-4 bg-ui-muted border border-ui-border rounded-lg text-foreground placeholder-muted-foreground font-figtree focus:outline-none focus:ring-2 focus:ring-ui-ring"
              />
            </div>
            <button className="flex items-center justify-center gap-2 h-10 px-4 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition">
              <Funnel className="w-4 h-4" />
              Filter
            </button>

            <button 
              onClick={fetchAppointments}
              disabled={loading}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-blue hover:bg-blue-light text-white text-sm font-medium rounded-lg transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-3 gap-6">
            {/* Pending */}
            <div>
              <h2 
                onClick={() => toggleSort('pending')}
                className="flex items-center gap-1 text-lg font-semibold mb-3 text-foreground cursor-pointer hover:text-blue transition"
              >
                Pending ({pending.length}) 
                <ArrowUpDown className={`w-4 h-4 transition-transform ${sortOrders.pending === 'asc' ? 'rotate-180' : ''}`} />
              </h2>
              <div className="space-y-4">
                {pending.map(appt => (
                  <AppointmentCard
                    key={appt._id}
                    appt={appt}
                    onClick={setSelectedAppointment}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </div>

            {/* Scheduled */}
            <div>
              <h2 
                onClick={() => toggleSort('scheduled')} 
                className="flex items-center gap-1 text-lg font-semibold mb-3 text-foreground cursor-pointer hover:text-blue transition"
              >
                Scheduled ({scheduled.length}) 
                <ArrowUpDown className={`w-4 h-4 transition-transform ${sortOrders.scheduled === 'asc' ? 'rotate-180' : ''}`} />
              </h2>
              <div className="space-y-4">
                {scheduled.map(appt => (
                  <AppointmentCard
                    key={appt._id}
                    appt={appt}
                    onClick={setSelectedAppointment}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </div>

            {/* Completed */}
            <div>
              <h2 
                onClick={() => toggleSort('completed')} 
                className="flex items-center gap-1 text-lg font-semibold mb-3 text-foreground cursor-pointer hover:text-blue transition"
              >
                Completed ({completed.length}) 
                <ArrowUpDown className={`w-4 h-4 transition-transform ${sortOrders.completed === 'asc' ? 'rotate-180' : ''}`} />
              </h2>
              <div className="space-y-4">
                {completed.map(appt => (
                  <AppointmentCard
                    key={appt._id}
                    appt={appt}
                    onClick={setSelectedAppointment}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </div>

            {/* Cancelled */}
            <div>
              <h2 onClick={() => toggleSort('cancelled')} className="flex items-center gap-1 text-lg font-semibold mb-3 text-foreground cursor-pointer hover:text-blue transition">
                Cancelled ({cancelled.length})
                <ArrowUpDown className={`... ${sortOrders.cancelled === 'asc' ? 'rotate-180' : ''}`} />
              </h2>
              <div className="space-y-4">
                {cancelled.map(appt => (
                  <AppointmentCard key={appt._id} appt={appt} onClick={setSelectedAppointment} formatDate={formatDate} />
                ))}
              </div>
            </div>
            
            {/* Rejected */}
            <div>
              <h2 onClick={() => toggleSort('rejected')} className="flex items-center gap-1 text-lg font-semibold mb-3 text-foreground cursor-pointer hover:text-blue transition">
                Rejected ({rejected.length})
                <ArrowUpDown className={`... ${sortOrders.rejected === 'asc' ? 'rotate-180' : ''}`} />
              </h2>
              <div className="space-y-4">
                {rejected.map(appt => (
                  <AppointmentCard key={appt._id} appt={appt} onClick={setSelectedAppointment} formatDate={formatDate} />
                ))}
              </div>
            </div>
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
                    {/* <p className="text-sm text-muted-foreground">📞 {selectedAppointment.patient?.contact || "N/A"}</p> */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      selectedAppointment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : selectedAppointment.status === "Scheduled"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
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
              <div className=" border-ui-border mb-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-foreground mb-2">Patient Notes</h4>
                  <div className="bg-ui-muted rounded-lg p-3">
                    <p className="text-sm text-foreground">{selectedAppointment.notes}</p>
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
                  fetchAppointments(); // Refresh list
                  setSelectedAppointment(null); // Optional: clear selection
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