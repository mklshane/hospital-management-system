import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";
import { api } from "@/lib/axiosHeader";
import Input from "@/components/Common/Input";
import Select from "@/components/Common/Select";

const PatientModal = ({ isOpen, onClose, patient = null, mode = "create" }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
  });

  const genders = ["Male", "Female", "Other"];

  // Reset form when modal opens/closes or patient changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && patient) {
        setFormData({
          name: patient.name || "",
          email: patient.email || "",
          password: "", // Don't pre-fill password
          age: patient.age || "",
          gender: patient.gender || "",
          contact: patient.contact || "",
          address: patient.address || "",
        });
      } else {
        setFormData({
          name: "",
          email: "",
          password: "",
          age: "",
          gender: "",
          contact: "",
          address: "",
        });
      }
    }
  }, [isOpen, patient, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        ...(mode === "edit" && !formData.password && { password: undefined }),
      };

      if (mode === "create") {
        await api.post("/patient", payload);
        alert("Patient created successfully!");
      } else {
        await api.put(`/patient/${patient._id}`, payload);
        alert("Patient updated successfully!");
      }

      onClose();
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} patient:`,
        error
      );
      alert(
        error.message ||
          `Failed to ${mode === "create" ? "create" : "update"} patient`
      );
    } finally {
      setLoading(false);
    }
  };

  const modalTitle =
    mode === "create" ? "Create Patient Account" : "Edit Patient Details";
  const submitButtonText =
    mode === "create" ? "Create Account" : "Update Patient";

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
              <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-ui-card p-8 shadow-xl transition-all border border-ui-border">
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

                {/* Form */}
                <div className="max-h-[70vh] overflow-y-auto -mx-2 px-2 space-y-6 py-2">
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
                      options={genders}
                      placeholder="Select gender"
                    />
                    <Input
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="e.g. 25"
                    />
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
                  </div>

                  {/* Address Field - Full Width */}
                  <div className="relative z-0">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-ui-muted border border-ui-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-ui-card focus:border-transparent resize-none"
                      placeholder="Enter patient's address"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-ui-border">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 border border-ui-border text-foreground rounded-lg hover:bg-ui-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-5 py-2 bg-blue hover:bg-blue/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : submitButtonText}
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

export default PatientModal;
