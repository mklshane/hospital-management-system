import React, { useEffect, useState } from "react";
import CollapsibleSection from "./CollapsibleSection";
import { api } from "../../lib/axiosHeader";
import { format } from "date-fns";
import MedicalRecordModal from "./MedicalRecordModal";
import { Edit3 } from "lucide-react";

const MedicalRecordsSection = ({ patientId: propPatientId, patientName = "" }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

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
  }, [patientId]);

  const openEditModal = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleRecordUpdated = (updatedRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r._id === updatedRecord._id ? updatedRecord : r))
    );
    closeModal();
  };

  const title = patientName ? `Medical Records` : "Medical Records History";

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
        <p className="text-sm text-muted-foreground">Loading records...</p>
      </CollapsibleSection>
    );
  }

  return (
    <>
      <CollapsibleSection title={title} badge={records.length.toString()} badgeColor="bg-cyan-400" defaultOpen={false}>
        <div className="space-y-1 p-2">
          {records.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-2">
              No records yet. Your doctor will add one after your appointment.
            </p>
          ) : (
            records.map((record) => {
              const date = format(new Date(record.appointment.appointment_date), "dd MMM yyyy");
              const time = record.appointment?.appointment_time || "—";
              const status = record.appointment?.status || "";
              const canEdit = status === "Scheduled";

              return (
                <div
                  key={record._id}
                  className="flex items-start justify-between px-3 py-2 bg-ui-muted rounded-lg hover:bg-ui-muted/50 transition gap-3"
                >
                  <div className="flex-1">
                    {/* Diagnosis */}
                    <p className="font-medium text-foreground">{record.diagnosis}</p>

                    {/* Symptoms */}
                    {record.symptoms && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">Symptoms:</span> {record.symptoms}
                      </p>
                    )}

                    {/* Prescriptions */}
                    {record.prescriptions?.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">Rx:</span>
                        <span className="ml-1">
                          {record.prescriptions
                            .map((p) => `${p.medicine} (${p.dosage}, ${p.duration})`)
                            .join(" • ")}
                        </span>
                      </div>
                    )}

                    {/* Doctor + Date + Time */}
                    <p className="text-xs text-muted-foreground mt-1">
                      Dr. {record.doctor?.name || "—"} • {date} • {time}
                    </p>
                  </div>

                  {/* EDIT BUTTON – ONLY FOR SCHEDULED */}
                  {canEdit && (
                    <button
                      onClick={() => openEditModal(record)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-xs hover:underline"
                      title="Edit record"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CollapsibleSection>

      {/* REUSABLE MODAL FOR EDITING */}
      <MedicalRecordModal
        isOpen={isModalOpen}
        onClose={closeModal}
        appointment={{
          _id: editingRecord?.appointment?._id,
          patientName: patientName || "Patient",
          date: editingRecord?.appointment?.appointment_date
            ? format(new Date(editingRecord.appointment.appointment_date), "dd MMM yyyy")
            : "",
          time: editingRecord?.appointment?.appointment_time || "",
          notes: editingRecord?.appointment?.notes || "",
        }}
        existingRecord={editingRecord}
        onRecordUpdated={handleRecordUpdated}
        onRecordAdded={() => {
        }}
      />
    </>
  );
};

export default MedicalRecordsSection;