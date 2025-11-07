import React, { useEffect, useState } from "react";
import CollapsibleSection from "./CollapsibleSection";
import { api } from "../../lib/axiosHeader";
import { format } from "date-fns";

const MedicalRecordsSection = ({ patientId: propPatientId, patientName = "" }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback to logged-in user only if no prop is passed
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fallbackId = user?._id || user?.id;
  const patientId = propPatientId || fallbackId;

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    const fetchRecords = async () => {
      try {
        setLoading(true);
        console.log("Fetching records for patient:", patientId);
        const res = await api.get(`/record/${patientId}`);

        if (!res.data?.records || !Array.isArray(res.data.records)) {
          setRecords([]);
          return;
        }

        const list = res.data.records.map((record) => {
          const apptDate = new Date(record.appointment?.appointment_date);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          let _category = "archived";
          if (apptDate >= thirtyDaysAgo) _category = "recent";
          else _category = "older";

          return { ...record, _category };
        });

        setRecords(list);
      } catch (err) {
        console.error("Failed to fetch records:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [patientId]); // Re-fetch when patientId changes

  const title = patientName
    ? `Medical Records`
    : "Medical Records History";

  if (!patientId) {
    return (
      <CollapsibleSection title={title} badge="0" badgeColor="bg-cyan-400" defaultOpen={false}>
        <p className="p-3 text-sm text-muted-foreground">Please log in to view records.</p>
      </CollapsibleSection>
    );
  }

  if (loading) {
    return (
      <CollapsibleSection title={title} badge="..." badgeColor="bg-cyan-400" defaultOpen={false}>
        <p className="p-3 text-sm text-muted-foreground">Loading records...</p>
      </CollapsibleSection>
    );
  }

  return (
    <CollapsibleSection title={title} badge={records.length.toString()} badgeColor="bg-cyan-400" defaultOpen={false}>
      <div className="space-y-3 p-2">
        {records.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-2">
            No records yet. Your doctor will add one after your appointment.
          </p>
        ) : (
          records.map((record) => {
            const date = format(new Date(record.appointment.appointment_date), "dd MMM yyyy");
            return (
              <div
                key={record._id}
                className="flex items-center justify-between p-3 bg-ui-muted/30 rounded-lg hover:bg-ui-muted/50 transition"
              >
                <div>
                  <p className="font-medium text-foreground">{record.diagnosis}</p>
                  <p className="text-xs text-muted-foreground">
                    Dr. {record.doctor?.name || "—"} • {date}
                  </p>
                </div>
                <button className="text-xs text-blue hover:underline font-medium">
                  View
                </button>
              </div>
            );
          })
        )}
      </div>
    </CollapsibleSection>
  );
};

export default MedicalRecordsSection;