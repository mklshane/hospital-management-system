import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { api } from "../../lib/axiosHeader";
import toast from "react-hot-toast";

const MedicalRecordModal = ({
  isOpen,
  onClose,
  appointment,
  onRecordAdded,
  onRecordUpdated,
  onRecordDeleted,
  existingRecord,
}) => {
  const isEdit = !!existingRecord;

  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescriptions, setPrescriptions] = useState([
    { medicine: "", dosage: "", duration: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && existingRecord) {
      setSymptoms(existingRecord.symptoms || "");
      setDiagnosis(existingRecord.diagnosis || "");
      setPrescriptions(
        existingRecord.prescriptions.length > 0
          ? existingRecord.prescriptions.map(p => ({
              medicine: p.medicine,
              dosage: p.dosage,
              duration: p.duration,
            }))
          : [{ medicine: "", dosage: "", duration: "" }]
      );
    } else {
      setSymptoms("");
      setDiagnosis("");
      setPrescriptions([{ medicine: "", dosage: "", duration: "" }]);
    }
  }, [isEdit, existingRecord]);

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { medicine: "", dosage: "", duration: "" }]);
  };

  const updatePrescription = (index, field, value) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const removePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!diagnosis.trim()) {
      toast.error("Diagnosis is required");
      return;
    }

    const validPrescriptions = prescriptions
      .filter((p) => p.medicine.trim() && p.dosage.trim() && p.duration.trim())
      .map((p) => ({
        medicine: p.medicine.trim(),
        dosage: p.dosage.trim(),
        duration: p.duration.trim(),
      }));

    if (validPrescriptions.length === 0) {
      toast.error("At least one complete prescription is required");
      return;
    }

    const payload = {
      symptoms: symptoms.trim(),
      diagnosis: diagnosis.trim(),
      prescriptions: validPrescriptions,
    };

    setIsSubmitting(true);
    try {
      let res;
      if (isEdit && existingRecord?._id) {
        console.log("Updating record ID:", existingRecord._id);
        res = await api.put(`/record/${existingRecord._id}`, payload);
        toast.success("Record updated successfully!");
        onRecordUpdated?.(res.data.record);
      } else {
        console.log("Creating new record for appointment:", appointment._id);
        res = await api.post(`/record/${appointment._id}`, payload);
        toast.success("Medical record saved successfully!");
        onRecordAdded?.(res.data.record);
      }
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to save record";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
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
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl max-h-[90vh] transform overflow-hidden rounded-xl bg-white p-4 sm:p-6 shadow-xl transition-all flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900">
                    {isEdit
                      ? existingRecord?.appointment?.status === "Completed"
                        ? "View Medical Record"
                        : "Edit Medical Record"
                      : "Add Medical Record"}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Patient Info */}
                {appointment && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <div>
                      <span className="font-medium">Patient Name</span>
                      <p className="truncate">{appointment.patientName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Appointment</span>
                      <p className="truncate">{appointment.date} | {appointment.time}</p>
                    </div>
                    <div>
                      <span className="font-medium">Notes</span>
                      <p className="truncate">{appointment.notes || "-"}</p>
                    </div>
                  </div>
                )}

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                  {/* === READ-ONLY MODE (COMPLETED) === */}
                  {isEdit && existingRecord?.appointment?.status === "Completed" ? (
                    <div className="space-y-4">
                      {/* Symptoms - Read Only */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Symptoms
                        </label>
                        <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm min-h-[60px]">
                          {symptoms || "-"}
                        </p>
                      </div>

                      {/* Diagnosis - Read Only */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Diagnosis <span className="text-red-500">*</span>
                        </label>
                        <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm min-h-[60px]">
                          {diagnosis}
                        </p>
                      </div>

                      {/* Prescriptions - Read Only */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prescription <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {prescriptions.map((p, i) => (
                            <div key={i} className="flex gap-2 text-sm">
                              <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                {p.medicine}
                              </div>
                              <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                {p.dosage}
                              </div>
                              <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                {p.duration}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* === EDITABLE MODE (SCHEDULED or ADD) === */}
                      {/* Symptoms */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Symptoms
                        </label>
                        <textarea
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          placeholder="Enter symptoms..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                          rows={2}
                        />
                      </div>

                      {/* Diagnosis */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Diagnosis <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          placeholder="Enter diagnosis..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                          rows={2}
                        />
                      </div>

                      {/* Prescriptions */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prescription <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {prescriptions.map((p, i) => (
                            <div key={i} className="flex gap-2 items-start">
                              <input
                                type="text"
                                placeholder="Medicine"
                                value={p.medicine}
                                onChange={(e) => updatePrescription(i, "medicine", e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Dosage"
                                value={p.dosage}
                                onChange={(e) => updatePrescription(i, "dosage", e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Duration"
                                value={p.duration}
                                onChange={(e) => updatePrescription(i, "duration", e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                              <button
                                onClick={() => removePrescription(i)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                                disabled={prescriptions.length === 1}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={addPrescription}
                          className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Prescription
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 mt-4 border-t border-gray-200">
                  {/* Left side - Cancel + Delete */}
                  <div className="flex gap-2">
                    {isEdit && existingRecord?.appointment?.status !== "Completed" && (
                      <>
                        <button
                          onClick={onClose}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex-1 sm:flex-none"
                        >
                          Cancel
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => {
                            toast(
                              (t) => (
                                <div className="flex flex-col gap-3">
                                  <p className="text-sm">Are you sure you want to delete this record?</p>
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => toast.dismiss(t.id)}
                                      className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                    >
                                      No, keep it
                                    </button>
                                    <button
                                      onClick={async () => {
                                        toast.dismiss(t.id);
                                        try {
                                          await api.delete(`/record/${existingRecord._id}`);
                                          toast.success("Record deleted successfully");
                                          onRecordDeleted?.(existingRecord._id);
                                          onClose();
                                        } catch (err) {
                                          toast.error("Failed to delete record");
                                        }
                                      }}
                                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                      Yes, delete
                                    </button>
                                  </div>
                                </div>
                              ),
                              { duration: 10000 }
                            );
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 text-sm flex-1 sm:flex-none"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>

                  {/* Right side - Update/Save/Close */}
                  <div className="flex gap-2">
                    {!(isEdit && existingRecord?.appointment?.status === "Completed") ? (
                      <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm flex-1"
                      >
                        {isSubmitting
                          ? "Saving..."
                          : isEdit
                          ? "Update Record"
                          : "Save Record"}
                      </button>
                    ) : (
                      <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex-1"
                      >
                        Close
                      </button>
                    )}
                  </div>
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