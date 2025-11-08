import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  Save,
  Edit2,
  Trash2,
} from "lucide-react";
import Input from "@/components/Common/Input";
import Select from "@/components/Common/Select";
import { api } from "@/lib/axiosHeader";
import DeleteModal from "@/components/Common/DeleteModal";

const PatientDetailsModal = ({ isOpen, onClose, patient, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
  });

  const genders = ["Male", "Female", "Other"];

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || "",
        email: patient.email || "",
        age: patient.age || "",
        gender: patient.gender || "",
        contact: patient.contact || "",
        address: patient.address || "",
      });
    }
    setIsEditing(false);
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/patient/${patient._id}`, formData);
      alert("Patient updated successfully!");
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Failed to update patient");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/patient/${patient._id}`);
      alert("Patient deleted successfully!");
      setShowDeleteModal(false);
      onClose();
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Failed to delete patient");
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: patient.name || "",
      email: patient.email || "",
      age: patient.age || "",
      gender: patient.gender || "",
      contact: patient.contact || "",
      address: patient.address || "",
    });
    setIsEditing(false);
  };

  if (!patient) return null;

  return (
    <>
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
                <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-ui-card p-6 shadow-xl transition-all border border-ui-border">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-xl font-bold text-foreground">
                      {isEditing ? "Edit Patient" : "Patient Details"}
                    </Dialog.Title>
                    <div className="flex items-center gap-2">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-muted-foreground hover:text-blue hover:bg-blue/10 rounded-lg transition-colors"
                            title="Edit Patient"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleDeleteClick}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Patient"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : null}
                      <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Patient Information */}
                  <div className="space-y-6">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {isEditing ? (
                        <>
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
                            disabled // Email shouldn't be editable
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
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 p-3 bg-ui-muted rounded-lg">
                            <User className="w-5 h-5 text-blue" />
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Full Name
                              </p>
                              <p className="text-foreground font-medium">
                                {patient.name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-ui-muted rounded-lg">
                            <Mail className="w-5 h-5 text-blue" />
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Email
                              </p>
                              <p className="text-foreground font-medium">
                                {patient.email}
                              </p>
                            </div>
                          </div>

                          {patient.contact && (
                            <div className="flex items-center gap-3 p-3 bg-ui-muted rounded-lg">
                              <Phone className="w-5 h-5 text-blue" />
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Contact
                                </p>
                                <p className="text-foreground font-medium">
                                  {patient.contact}
                                </p>
                              </div>
                            </div>
                          )}

                          {(patient.age || patient.gender) && (
                            <div className="flex items-center gap-3 p-3 bg-ui-muted rounded-lg">
                              <Calendar className="w-5 h-5 text-blue" />
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Age & Gender
                                </p>
                                <p className="text-foreground font-medium">
                                  {patient.age && `Age: ${patient.age}`}
                                  {patient.age && patient.gender && " • "}
                                  {patient.gender || "Not specified"}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Address Field */}
                    <div>
                      {isEditing ? (
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
                      ) : patient.address ? (
                        <div className="flex items-start gap-3 p-3 bg-ui-muted rounded-lg">
                          <MapPin className="w-5 h-5 text-blue mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Address
                            </p>
                            <p className="text-foreground font-medium">
                              {patient.address}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-ui-border">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancelEdit}
                          className="px-5 py-2 border border-ui-border text-foreground rounded-lg hover:bg-ui-muted transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="px-5 py-2 bg-blue hover:bg-blue/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={onClose}
                        className="px-5 py-2 bg-blue hover:bg-blue/90 text-white rounded-lg transition-colors font-medium"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        description="Are you sure you want to delete this patient? All associated data will be permanently removed. This action cannot be undone."
        confirmText="Delete Patient"
        itemName={patient?.name}
      />
    </>
  );
};

export default PatientDetailsModal;
