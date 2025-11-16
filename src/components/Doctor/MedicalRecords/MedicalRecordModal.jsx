import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/axiosHeader";
import toast from "react-hot-toast";
import { useCrudOperations } from "@/hooks/useCrudOperations";

const MedicalRecordModal = ({
  isOpen,
  onClose,
  appointment,
  existingRecord,
  onRecordUpdated,
  refetchAppointments,
}) => {
  const isEdit = !!existingRecord?._id;

  const { create, update, loading } = useCrudOperations(
    "Medical Record",
    refetchAppointments
  );

  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescriptions, setPrescriptions] = useState([
    { medicine: "", dosage: "", duration: "" },
  ]);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      if (isEdit && existingRecord) {
        setSymptoms(existingRecord.symptoms || "");
        setDiagnosis(existingRecord.diagnosis || "");
        setPrescriptions(
          existingRecord.prescriptions?.length > 0
            ? existingRecord.prescriptions.map((p) => ({
                medicine: p.medicine || "",
                dosage: p.dosage || "",
                duration: p.duration || "",
              }))
            : [{ medicine: "", dosage: "", duration: "" }]
        );
      } else {
        setSymptoms("");
        setDiagnosis("");
        setPrescriptions([{ medicine: "", dosage: "", duration: "" }]);
      }
    }
  }, [isOpen, isEdit, existingRecord]);

  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medicine: "", dosage: "", duration: "" },
    ]);
  };

  const updatePrescription = (index, field, value) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const removePrescription = (index) => {
    if (prescriptions.length === 1) return;
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!diagnosis.trim()) {
      toast.error("Diagnosis is required");
      return false;
    }

    const validPrescriptions = prescriptions.filter(
      (p) => p.medicine.trim() && p.dosage.trim() && p.duration.trim()
    );

    if (validPrescriptions.length === 0) {
      toast.error("At least one complete prescription is required");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const validPrescriptions = prescriptions
      .filter((p) => p.medicine.trim() && p.dosage.trim() && p.duration.trim())
      .map((p) => ({
        medicine: p.medicine.trim(),
        dosage: p.dosage.trim(),
        duration: p.duration.trim(),
      }));

    const payload = {
      symptoms: symptoms.trim(),
      diagnosis: diagnosis.trim(),
      prescriptions: validPrescriptions,
    };

    try {
      let res;
      if (isEdit) {
        res = await update(
          existingRecord._id,
          payload,
          `/record/${existingRecord._id}`
        );
        if (res) {
          onRecordUpdated?.(res);
        }
      } else {
        res = await create(payload, `/record/${appointment._id}`);
        if (res) {
          // Call the callback when a new record is created
          onRecordUpdated?.(res);
        }
      }

      onClose();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save record";
      toast.error(message);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl max-h-[90vh] transform overflow-hidden rounded-xl bg-[#ffff] dark:bg-gray-950 border-2  p-4 sm:p-6 shadow-2xl transition-all flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg sm:text-xl font-semibold text-foreground">
                    {isEdit ? "Edit Medical Record" : "Add Medical Record"}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-ui-muted"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Patient Info */}
                {appointment && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 text-sm bg-ui-muted/50 p-3 rounded-lg border border-ui-border/50">
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Patient
                      </span>
                      <p className="truncate font-medium text-foreground">
                        {appointment.patientName}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Date & Time
                      </span>
                      <p className="truncate font-medium text-foreground">
                        {appointment.date} | {appointment.time}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Notes
                      </span>
                      <p className="truncate text-foreground text-xs italic">
                        {appointment.notes || "—"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Scrollable Form */}
                <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar space-y-5">
                  {/* Symptoms */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Symptoms
                    </label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe patient symptoms..."
                      className="w-full px-3 py-2 border border-ui-border rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent resize-none text-sm bg-ui-card text-foreground placeholder:text-muted-foreground"
                      rows={3}
                    />
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Diagnosis <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Enter diagnosis..."
                      className="w-full px-3 py-2 border border-ui-border rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent resize-none text-sm bg-ui-card text-foreground placeholder:text-muted-foreground"
                      rows={3}
                    />
                  </div>

                  {/* Prescriptions */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Prescriptions <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {prescriptions.map((p, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <input
                            type="text"
                            placeholder="Medicine"
                            value={p.medicine}
                            onChange={(e) =>
                              updatePrescription(i, "medicine", e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-ui-border rounded-lg focus:ring-2 focus:ring-blue text-sm bg-ui-card text-foreground placeholder:text-muted-foreground text-left"
                          />
                          <input
                            type="text"
                            placeholder="Dosage"
                            value={p.dosage}
                            onChange={(e) =>
                              updatePrescription(i, "dosage", e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-ui-border rounded-lg focus:ring-2 focus:ring-blue text-sm bg-ui-card text-foreground placeholder:text-muted-foreground text-left"
                          />
                          <input
                            type="text"
                            placeholder="Duration"
                            value={p.duration}
                            onChange={(e) =>
                              updatePrescription(i, "duration", e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-ui-border rounded-lg focus:ring-2 focus:ring-blue text-sm bg-ui-card text-foreground placeholder:text-muted-foreground text-left"
                          />
                          <button
                            onClick={() => removePrescription(i)}
                            disabled={prescriptions.length === 1}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addPrescription}
                      className="mt-3 flex items-center gap-1.5 text-blue hover:text-blue-700 font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Prescription
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-ui-border">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 border border-ui-border text-foreground rounded-lg hover:bg-ui-muted transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-5 py-2 bg-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center gap-1.5"
                  >
                    {loading ? (
                      "Saving..."
                    ) : (
                      <>{isEdit ? "Update" : "Save"} Record</>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MedicalRecordModal;
