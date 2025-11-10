// AppointmentHistorySection.jsx
import React, { useEffect, useState } from "react";
import CollapsibleSection from "./CollapsibleSection";
import { api } from "../../lib/axiosHeader";
import { format } from "date-fns";

const AppointmentHistorySection = ({
  patientId: propPatientId,
  patientName = "",
  refreshTrigger = 0,
  currentAppointmentId = null, 
}) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const patientId = propPatientId;

  // Early return if no patient selected
  if (!patientId) {
    return (
      <CollapsibleSection
        title="Appointment History"
        badge="0"
        badgeColor="bg-blue-700"
        defaultOpen={false}
      >
        <p className="pt-3 text-sm text-muted-foreground text-center">
          Select a patient to view history.
        </p>
      </CollapsibleSection>
    );
  }

  // Fetch past appointments using dedicated route
  useEffect(() => {
    if (!patientId) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setAppointments([]); // Clear previous

        console.log("Fetching history for patient:", patientId);

        // Use dedicated patient history endpoint
        const res = await api.get(`/appointment/patient/${patientId}`);

        let list = res.data?.appointments || [];

        // Exclude current appointment if provided
        if (currentAppointmentId) {
          list = list.filter((appt) => appt._id !== currentAppointmentId);
        }

        // Sort by date descending
        list.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

        setAppointments(list);
      } catch (err) {
        console.error("Failed to fetch appointment history:", err.response?.data || err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId, refreshTrigger, currentAppointmentId]); // Re-fetch on trigger or ID change

  const title = patientName
    ? `Appointment History`
    : "Appointment History";

  const renderEmpty = () => (
    <p className="text-center text-sm text-muted-foreground py-4">
      No past appointments recorded.
    </p>
  );

  const renderCard = (appt) => {
    const date = format(new Date(appt.appointment_date), "dd MMM yyyy");
    const time = appt.appointment_time || "—";
    const doctor = appt.doctor?.name || "Unknown Doctor";
    const status = appt.status;

    return (
      <div
        key={appt._id}
        className="flex flex-col py-3 px-4 bg-ui-muted/50 rounded-lg hover:bg-ui-muted/80 transition-all border border-ui-border/30"
      >
        <div className="flex justify-between items-start">
          <p className="font-semibold text-foreground">Dr. {doctor}</p>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              status === "Completed"
                ? "bg-green-100 text-green-800"
                : status === "Cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </span>
        </div>

        <p className="text-xs text-muted-foreground mt-1">
          {date} • {time}
        </p>

        {appt.notes ? (
          <p className="text-xs text-muted-foreground mt-2 italic">
            "{appt.notes}"
          </p>
        ) : null}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <CollapsibleSection
        title={title}
        badge="..."
        badgeColor="bg-blue-700"
        defaultOpen={false}
      >
        <div className="p-4">
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 bg-ui-muted/40 rounded-lg animate-pulse border border-ui-border/20"
              />
            ))}
          </div>
        </div>
      </CollapsibleSection>
    );
  }

  return (
    <CollapsibleSection
      title={title}
      badge={appointments.length.toString()}
      badgeColor="bg-blue-700"
      defaultOpen={false}
    >
      <div className="space-y-3 p-2 pb-4">
        {appointments.length === 0 ? renderEmpty() : appointments.map(renderCard)}
      </div>
    </CollapsibleSection>
  );
};

export default AppointmentHistorySection;