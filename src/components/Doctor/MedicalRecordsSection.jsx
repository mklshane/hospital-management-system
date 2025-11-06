/* MedicalRecordsSection.jsx */
import React, { useEffect, useState } from "react";
import CollapsibleSection from "./CollapsibleSection";
import { api } from "../../lib/axiosHeader";
import { format } from "date-fns";

const MedicalRecordsSection = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get patient ID from login session
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const patientId = user?._id || user?.id;

  useEffect(() => {
    if (!patientId) {
        setLoading(false);
        return;
    }

    const fetchMyRecords = async () => {
        try {
        setLoading(true);
        console.log("Fetching from: /record/" + patientId);

        const res = await api.get(`/record/${patientId}`);

        console.log("Raw API response:", res);
        console.log("Response data:", res.data);
        console.log("Records array:", res.data?.records);

        if (!res.data?.records || res.data.records.length === 0) {
            console.warn("No records found for this patient.");
            setRecords([]);
            return;
        }

        // Add categories like in DoctorMedicalRecords for consistency (optional)
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
        console.error("Fetch failed:", err);
        console.error("Error response:", err.response?.data);
        } finally {
        setLoading(false);
        }
    };

    fetchMyRecords();
    }, [patientId]);


  // Show login prompt if not logged in
  if (!patientId) {
    return (
      <CollapsibleSection
        title="Medical Records History"
        badge="0"
        badgeColor="bg-cyan-400"
        defaultOpen={false}
      >
        <p className="p-3 text-sm text-muted-foreground">Please log in to view your records.</p>
      </CollapsibleSection>
    );
  }

  // Show loading only while fetching
  if (loading) {
    return (
      <CollapsibleSection
        title="Medical Records History"
        badge="..."
        badgeColor="bg-cyan-400"
        defaultOpen={false}
      >
        <p className="p-3 text-sm text-muted-foreground">Loading your records...</p>
      </CollapsibleSection>
    );
  }

  return (
    <CollapsibleSection
      title="Medical Records History"
      badge={records.length.toString()}
      badgeColor="bg-cyan-400"
      defaultOpen={false}
    >
      <div className="space-y-3 p-2">
        {records.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-2">
            No records yet. Your doctor will add one after your appointment.
          </p>
        ) : (
          records.map((record) => {
            const date = format(
              new Date(record.appointment.appointment_date),
              "dd MMM yyyy"
            );

            return (
              <div
                key={record._id}
                className="flex items-center justify-between p-3 bg-ui-muted/30 rounded-lg hover:bg-ui-muted/50 transition"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {record.diagnosis}
                  </p>
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