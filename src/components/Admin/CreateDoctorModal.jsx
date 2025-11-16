import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import Input from "@/components/Common/Input";
import Select from "@/components/Common/Select";
import TimeSlotSelector from "@/components/Common/TimeSlotSelector";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import toast from "react-hot-toast";

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

const CreateDoctorModal = ({ isOpen, onClose, refetch }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    contact: "",
    specialization: "",
  });
  const [scheduleTime, setScheduleTime] = useState([]);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use your custom hook
  const { create, loading } = useCrudOperations("Doctor", refetch);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        age: "",
        gender: "",
        contact: "",
        specialization: "",
      });
      setScheduleTime([]);
      setStep(1);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Client-side validation
    if (scheduleTime.length === 0) {
      toast.error(
        "Please select at least one time slot for the doctor's schedule"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const payload = {
      ...formData,
      schedule_time: scheduleTime,
    };
    delete payload.confirmPassword;

    // Use hook's create() — handles API, toast, loading, refetch
    const success = await create(payload, "/auth/doctor/register");
    if (success) {
      onClose();
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
              <Dialog.Panel className="w-full max-w-4xl transform rounded-2xl bg-ui-surface p-8 shadow-xl transition-all border border-ui-border">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-semibold text-foreground">
                    Create Doctor Account
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
                        placeholder="John Doe"
                        required
                      />
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Contact"
                        name="contact"
                        required
                        placeholder="0912345678"
                        value={formData.contact}
                        onChange={handleChange}
                      />
                      <Select
                        label="Gender"
                        name="gender"
                        required
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
                        required
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

                  {/* Step 2: Schedule Time */}
                  {step === 2 && (
                    <div className="space-y-4 py-2">
                      <TimeSlotSelector
                        selectedSlots={scheduleTime}
                        onSlotsChange={setScheduleTime}
                      />
                    </div>
                  )}

                  {/* Step 3: Password */}
                  {step === 3 && (
                    <div className="grid grid-cols-2 gap-4 py-2">
                      {/* Password */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="*******"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <Eye className="w-5 h-5" />
                            ) : (
                              <EyeOff className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Confirm Password{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="*******"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? (
                              <Eye className="w-5 h-5" />
                            ) : (
                              <EyeOff className="w-5 h-5" />
                            )}
                          </button>
                        </div>
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
                        disabled={loading || scheduleTime.length === 0}
                        className="px-5 py-2 bg-blue hover:bg-blue/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Creating..." : "Create Account"}
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
