// AppointmentHistorySection.jsx
import React, { useEffect, useState } from "react";
import CollapsibleSection from "./CollapsibleSection";
import { api } from "../../lib/axiosHeader";
import { format } from "date-fns";

const AppointmentHistorySection = ({ patientId: propPatientId, patientName = "" }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---- patient id handling -------------------------------------------------
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Remove fallback
    const patientId = propPatientId;

    // Add safety check
    if (!patientId) {
    return (
        <CollapsibleSection title={title} badge="0" badgeColor="bg-blue-700" defaultOpen={false}>
        <p className="pt-3 text-sm text-muted-foreground">
            Select a patient to view history.
        </p>
        </CollapsibleSection>
    );
    }

  // ---- fetch appointments --------------------------------------------------
    useEffect(() => {
    setAppointments([]);
    // No need to check !patientId here — already returned above

    const fetchAppointments = async () => {
        try {
        setLoading(true);
        console.log("Fetching history for patient:", patientId);

        const res = await api.get(`/appointment?patient=${patientId}`);

        const list = (res.data?.appointments || [])
            .filter((a) => {
            const apptDateTime = new Date(`${a.appointment_date}T${a.appointment_time}`);
            const isPast = apptDateTime < new Date();
            return ["Completed", "Cancelled"].includes(a.status) || (a.status === "Scheduled" && isPast);
            })
            .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

        setAppointments(list);
        } catch (err) {
        console.error("Failed to fetch appointment history:", err.response?.data || err);
        setAppointments([]);
        } finally {
        setLoading(false);
        }
    };

    fetchAppointments();
    }, [patientId]); // Re-fetch when patient changes
  
    // ---- titles --------------------------------------------------------------
  const title = patientName ? `Appointment History` : "Appointment History";

  // ---- render helpers -------------------------------------------------------
  const renderEmpty = () => (
    <p className="text-center text-sm text-muted-foreground py-2">
      No past appointments recorded.
    </p>
  );

  const renderCard = (appt) => {
    const date = format(new Date(appt.appointment_date), "dd MMM yyyy");
    const time = appt.appointment_time || "—";
    const doctor = appt.doctor?.name || "—";

    return (
      <div
        key={appt._id}
        className="flex flex-col py-2 px-4 bg-ui-muted rounded-lg hover:bg-ui-muted/50 transition"
      >
        <p className="font-medium text-foreground">Dr. {doctor}</p>

        <p className="text-xs text-muted-foreground mt-1">
          {date} • {time}
        </p>

        {appt.notes ? (
          <p className="text-xs text-muted-foreground mt-2">
            <span className="font-medium">Notes:</span> {appt.notes}
          </p>
        ) : null}
      </div>
    );
  };

  // ---- final render ---------------------------------------------------------
  if (!patientId) {
    return (
      <CollapsibleSection title={title} badge="0" badgeColor="bg-blue-700" defaultOpen={false}>
        <p className="p-3 text-sm text-muted-foreground">
          Please log in to view appointment history.
        </p>
      </CollapsibleSection>
    );
  }

  if (loading) {
    return (
      <CollapsibleSection title={title} badge="..." badgeColor="bg-blue-700" defaultOpen={false}>
        <p className="p-3 text-sm text-muted-foreground">Loading appointments...</p>
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
      <div className="space-y-3 p-2">
        {appointments.length === 0 ? renderEmpty() : appointments.map(renderCard)}
      </div>
    </CollapsibleSection>
  );
};

export default AppointmentHistorySection;