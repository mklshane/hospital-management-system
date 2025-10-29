import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { api } from "../lib/axiosHeader";
import toast from "react-hot-toast";

const MedicalRecordModal = ({
  isOpen,
  onClose,
  appointment,
  onRecordAdded,
}) => {
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescriptions, setPrescriptions] = useState([
    { medicine: "", dosage: "", duration: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const res = await api.post(`/record/${appointment._id}`, payload);
      toast.success("Medical record saved successfully!");
      onRecordAdded?.(res.data.record);
      onClose();
    } catch (error) {
      const message = error.message || "Failed to save record";
      toast.error(message);
      console.error("Save record error:", error);
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
          <div className="fixed inset-0 bg-black/2 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    Medical Record
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Patient Info */}
                {appointment && (
                  <div className="grid grid-cols-3 gap-4 mb-6 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Patient Name</span>
                      <p>{appointment.patientName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Appointment</span>
                      <p>{appointment.date} | {appointment.time}</p>
                    </div>
                    <div>
                      <span className="font-medium">Notes</span>
                      <p className="truncate">{appointment.notes || "-"}</p>
                    </div>
                  </div>
                )}

                {/* Symptoms */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Enter symptoms..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Diagnosis */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Enter diagnosis..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Prescriptions */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prescription <span className="text-red-500">*</span>
                  </label>
                  {prescriptions.map((p, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Medicine name"
                        value={p.medicine}
                        onChange={(e) => updatePrescription(i, "medicine", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={p.dosage}
                        onChange={(e) => updatePrescription(i, "dosage", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={p.duration}
                        onChange={(e) => updatePrescription(i, "duration", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removePrescription(i)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={prescriptions.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addPrescription}
                    className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Prescription
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Save Record"}
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