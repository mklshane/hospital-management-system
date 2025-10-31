import React, { useState, useMemo, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";
import { api } from "@/lib/axiosHeader";
import Input from "@/components/Common/Input";
import Select from "@/components/Common/Select";

const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "General Medicine",
  "Ophthalmology",
  "Psychiatry",
  "ENT",
  "Radiology",
];

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = i % 2 === 0 ? "00" : "30";
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minute} ${period}`;
});

const CreateDoctorModal = ({
  isOpen,
  onClose,
  doctor = null,
  mode = "create",
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    contact: "",
    specialization: "",
    startTime: "",
    endTime: "",
  });

  // Reset form when modal opens/closes or doctor changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && doctor) {
        setFormData({
          name: doctor.name || "",
          email: doctor.email || "",
          password: "", // Don't pre-fill password
          age: doctor.age || "",
          gender: doctor.gender || "",
          contact: doctor.contact || "",
          specialization: doctor.specialization || "",
          startTime: doctor.schedule_time?.[0] || "",
          endTime:
            doctor.schedule_time?.[doctor.schedule_time?.length - 1] || "",
        });
      } else {
        setFormData({
          name: "",
          email: "",
          password: "",
          age: "",
          gender: "",
          contact: "",
          specialization: "",
          startTime: "",
          endTime: "",
        });
      }
      setStep(1);
    }
  }, [isOpen, doctor, mode]);

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const schedule_time = useMemo(() => {
    if (!formData.startTime || !formData.endTime) return [];
    const startIdx = TIME_SLOTS.indexOf(formData.startTime);
    const endIdx = TIME_SLOTS.indexOf(formData.endTime);
    if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) return [];
    return TIME_SLOTS.slice(startIdx, endIdx + 1);
  }, [formData.startTime, formData.endTime]);

  const handleSubmit = async () => {
    if (schedule_time.length === 0) {
      alert("Please select a valid time range");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        schedule_time,
        ...(mode === "edit" && !formData.password && { password: undefined }),
      };

      if (mode === "create") {
        await api.post("/doctor", payload);
        alert("Doctor created successfully!");
      } else {
        await api.put(`/doctor/${doctor._id}`, payload);
        alert("Doctor updated successfully!");
      }

      onClose();
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} doctor:`,
        error
      );
      alert(
        error.message ||
          `Failed to ${mode === "create" ? "create" : "update"} doctor`
      );
    } finally {
      setLoading(false);
    }
  };

  const modalTitle =
    mode === "create" ? "Create Doctor Account" : "Edit Doctor Details";
  const submitButtonText =
    mode === "create" ? "Create Account" : "Update Doctor";

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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-3xl transform rounded-2xl bg-ui-card p-8 shadow-xl transition-all border border-ui-border">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-semibold text-foreground">
                    {modalTitle}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Step Indicator */}
                <div className="flex justify-center mb-6">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-2 w-12 mx-1 rounded-full transition-colors ${
                        step >= s ? "bg-blue" : "bg-ui-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Scrollable Form */}
                <div className="max-h-[70vh] overflow-y-auto -mx-2 px-2 space-y-6 py-2">
                  {/* Step 1: Personal Info */}
                  {step === 1 && (
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={mode === "edit"}
                      />
                      <Input
                        label="Contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                      />
                      <Select
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        options={["Male", "Female", "Other"]}
                        placeholder="Select gender"
                      />
                      <Input
                        label="Age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="e.g. 35"
                      />
                      <Select
                        label="Specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        options={SPECIALIZATIONS}
                        required
                        placeholder="Select specialization"
                      />
                    </div>
                  )}

                  {/* Step 2: Time Range */}
                  {step === 2 && (
                    <div className="space-y-5 py-2">
                      <div className="grid grid-cols-2 gap-4">
                        <Select
                          label="Start Time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          options={TIME_SLOTS}
                          required
                          placeholder="Select start time"
                        />
                        <Select
                          label="End Time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          options={TIME_SLOTS}
                          required
                          placeholder="Select end time"
                        />
                      </div>

                      {schedule_time.length > 0 && (
                        <div className="p-3 bg-ui-muted rounded-lg border border-ui-border">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Selected Slots ({schedule_time.length})
                          </p>
                          <div className="flex flex-wrap gap-1 text-xs">
                            {schedule_time.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-1 bg-blue/10 text-blue rounded-full"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Password */}
                  {step === 3 && (
                    <div className="grid grid-cols-2 gap-4 py-2">
                      <Input
                        label={
                          mode === "create"
                            ? "Password"
                            : "New Password (leave blank to keep current)"
                        }
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={mode === "create"}
                        placeholder={
                          mode === "edit"
                            ? "Leave blank to keep current password"
                            : ""
                        }
                      />
                      <div className="relative z-0">
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Confirm Password{" "}
                          {mode === "create" && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-ui-muted border border-ui-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-ui-card focus:border-transparent"
                          onChange={(e) => {
                            if (
                              mode === "create" &&
                              e.target.value !== formData.password
                            ) {
                              e.target.setCustomValidity(
                                "Passwords do not match"
                              );
                            } else {
                              e.target.setCustomValidity("");
                            }
                          }}
                          required={mode === "create"}
                          placeholder={
                            mode === "edit" ? "Confirm new password" : ""
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-ui-border">
                  <button
                    onClick={prevStep}
                    disabled={step === 1}
                    className="px-5 py-2 border border-ui-border text-foreground rounded-lg hover:bg-ui-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="px-5 py-2 border border-ui-border text-foreground rounded-lg hover:bg-ui-muted transition-colors"
                    >
                      Cancel
                    </button>
                    {step < 3 ? (
                      <button
                        onClick={nextStep}
                        className="px-5 py-2 bg-blue hover:bg-blue/90 text-white rounded-lg transition-colors font-medium"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 bg-blue hover:bg-blue/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Processing..." : submitButtonText}
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

export default CreateDoctorModal;
