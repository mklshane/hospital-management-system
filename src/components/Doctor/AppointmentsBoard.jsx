import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Funnel, ArrowUpDown, X, Check } from "lucide-react";
import AppointmentCard from "@/components/Doctor/AppointmentCard";
import ThemeToggle from "@/components/ThemeToggle";
import BoardSkeletonColumn from "@/components/Common/BoardSkeletonColumn";

const statusOptions = [
  { key: "pending", label: "Pending", color: "yellow" },
  { key: "scheduled", label: "Scheduled", color: "blue" },
  { key: "completed", label: "Completed", color: "green" },
  { key: "cancelled", label: "Cancelled", color: "red" },
  { key: "rejected", label: "Rejected", color: "purple" },
];

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
        statusData.color === "yellow"
          ? "bg-yellow-500"
          : statusData.color === "blue"
          ? "bg-blue-500"
          : statusData.color === "green"
          ? "bg-green-500"
          : statusData.color === "red"
          ? "bg-red-500"
          : "bgPurple-500"
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

const AppointmentsBoard = ({
  appointments,
  loading,
  refetch,
  searchTerm,
  setSearchTerm,
  selectedFilters,
  setSelectedFilters,
  selectedAppointment,
  setSelectedAppointment,
  formatDate,
}) => {
  const [sortOrders, setSortOrders] = useState({
    pending: "asc",
    scheduled: "asc",
    completed: "desc",
    cancelled: "desc",
    rejected: "desc",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const toggleFilter = (key) => {
    setSelectedFilters((prev) => {
      if (prev.includes(key)) return prev.filter((f) => f !== key);
      if (prev.length >= 3) {
        setAlertMessage("You can select a maximum of 3 statuses.");
        setTimeout(() => setAlertMessage(""), 4000);
        return prev;
      }
      return [...prev, key];
    });
  };

  const toggleSort = (column) => {
    setSortOrders((prev) => ({
      ...prev,
      [column]: prev[column] === "desc" ? "asc" : "desc",
    }));
  };

  const sortByDate = (list, order) => {
    return [...list].sort((a, b) => {
      const parse = (appt) => {
        const d = new Date(appt.appointment_date);
        if (isNaN(d)) return 0;
        const t = appt.appointment_time?.trim();
        if (!t) return d.getTime();

        let [h, m = 0] = t.split(":").map(Number);
        const upper = t.toUpperCase();
        const period =
          upper.includes("AM") || upper.includes("PM")
            ? upper.split(" ")[1]
            : null;

        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;

        d.setHours(h, m, 0, 0);
        return d.getTime();
      };
      const ta = parse(a),
        tb = parse(b);
      return order === "desc" ? tb - ta : ta - tb;
    });
  };

  const filteredAppointments = useMemo(() => {
    const lower = searchTerm.toLowerCase().trim();
    const searched = lower
      ? appointments.filter((a) => {
          const fields = [
            a.patient?.name,
            a.appointment_date,
            a.appointment_time,
            a.notes,
          ];
          return fields.some((f) => f?.toLowerCase().includes(lower));
        })
      : appointments;

    const byStatus = {
      pending: searched.filter((a) => a.status === "Pending"),
      scheduled: searched.filter((a) => a.status === "Scheduled"),
      completed: searched.filter((a) => a.status === "Completed"),
      cancelled: searched.filter((a) => a.status === "Cancelled"),
      rejected: searched.filter((a) => a.status === "Rejected"),
    };

    const result = {};
    selectedFilters.forEach((key) => {
      result[key] = sortByDate(byStatus[key] || [], sortOrders[key] || "desc");
    });
    return result;
  }, [appointments, searchTerm, selectedFilters, sortOrders]);

  return (
    <div className="scrollbar bg-ui-card border-2 rounded-xl pl-3 pt-3 pr-3 flex flex-col overflow-hidden shadow-xs col-span-9">
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
          Appointments
        </h1>
        <ThemeToggle />
      </div>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, date, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8 pl-7 pr-3 bg-ui-surface border rounded-lg text-xs text-foreground placeholder-muted-foreground font-figtree focus:outline-none focus:ring-1 focus:ring-ui-ring"
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
                  const checked = selectedFilters.includes(opt.key);
                  const count = appointments.filter(
                    (a) => a.status.toLowerCase() === opt.key
                  ).length;
                  return (
                    <label
                      key={opt.key}
                      onClick={() => toggleFilter(opt.key)}
                      className="flex items-center gap-2 p-1.5 rounded cursor-pointer hover:bg-ui-muted transition text-xs"
                    >
                      <div
                        className={`w-3 h-3 rounded border flex items-center justify-center transition ${
                          checked ? "bg-blue border-blue" : "border-ui-border"
                        }`}
                      >
                        {checked && <Check className="w-2 h-2 text-white" />}
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
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-2 pt-2 border-t border-ui-border">
                <button
                  onClick={() => {
                    setSelectedFilters(["pending", "scheduled", "completed"]);
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
          onClick={refetch}
          disabled={loading}
          className="flex items-center justify-center gap-1 h-8 px-3 bg-blue hover:bg-blue-dark text-white text-xs font-medium rounded-lg transition"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="relative flex-1 min-h-0 overflow-hidden">
        {/* SKELETON */}
        {loading && (
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
            loading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="grid grid-cols-3 gap-4 pb-4">
            {selectedFilters.map((filterKey) => {
              const statusData = statusOptions.find((s) => s.key === filterKey);
              const list = filteredAppointments[filterKey] || [];
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
                      No {statusData.label.toLowerCase()} appointments
                    </p>
                  ) : (
                    list.map((appt) => (
                      <AppointmentCard
                        key={appt._id}
                        appt={appt}
                        onClick={setSelectedAppointment}
                        formatDate={formatDate}
                        isSelected={selectedAppointment?._id === appt._id}
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
  );
};

export default AppointmentsBoard;
