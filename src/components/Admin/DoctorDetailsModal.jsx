import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  X,
  Mail,
  Phone,
  User,
  Clock,
  MapPin,
  Save,
  Edit2,
  Trash2,
} from "lucide-react";
import Input from "@/components/Common/Input";
import Select from "@/components/Common/Select";
import { api } from "@/lib/axiosHeader";
import DeleteModal from "@/components/Common/DeleteModal";

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

const DoctorDetailsModal = ({ isOpen, onClose, doctor, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    contact: "",
    specialization: "",
  });

  const genders = ["Male", "Female", "Other"];

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || "",
        email: doctor.email || "",
        age: doctor.age || "",
        gender: doctor.gender || "",
        contact: doctor.contact || "",
        specialization: doctor.specialization || "",
      });
    }
    setIsEditing(false);
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/doctor/${doctor._id}`, formData);
      alert("Doctor updated successfully!");
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Error updating doctor:", error);
      alert("Failed to update doctor");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/doctor/${doctor._id}`);
      alert("Doctor deleted successfully!");
      setShowDeleteModal(false);
      onClose();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor");
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: doctor.name || "",
      email: doctor.email || "",
      age: doctor.age || "",
      gender: doctor.gender || "",
      contact: doctor.contact || "",
      specialization: doctor.specialization || "",
    });
    setIsEditing(false);
  };

  if (!doctor) return null;

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
                      {isEditing ? "Edit Doctor" : "Doctor Details"}
                    </Dialog.Title>
                    <div className="flex items-center gap-2">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-muted-foreground hover:text-blue hover:bg-blue/10 rounded-lg transition-colors"
                            title="Edit Doctor"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleDeleteClick}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Doctor"
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

                  {/* Doctor Information */}
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
                                Dr. {doctor.name}
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
                                {doctor.email}
                              </p>
                            </div>
                          </div>

                          {doctor.contact && (
                            <div className="flex items-center gap-3 p-3 bg-ui-muted rounded-lg">
                              <Phone className="w-5 h-5 text-blue" />
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Contact
                                </p>
                                <p className="text-foreground font-medium">
                                  {doctor.contact}
                                </p>
                              </div>
                            </div>
                          )}

                          {(doctor.age || doctor.gender) && (
                            <div className="flex items-center gap-3 p-3 bg-ui-muted rounded-lg">
                              <User className="w-5 h-5 text-blue" />
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Age & Gender
                                </p>
                                <p className="text-foreground font-medium">
                                  {doctor.age && `Age: ${doctor.age}`}
                                  {doctor.age && doctor.gender && " • "}
                                  {doctor.gender || "Not specified"}
                                </p>
                              </div>
                            </div>
                          )}

                          {doctor.specialization && (
                            <div className="flex items-center gap-3 p-3 bg-ui-muted rounded-lg">
                              <MapPin className="w-5 h-5 text-blue" />
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Specialization
                                </p>
                                <p className="text-foreground font-medium">
                                  {doctor.specialization}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Schedule Times */}
                    {doctor.schedule_time &&
                      doctor.schedule_time.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue" />
                            Available Schedule
                          </h3>
                          <div className="p-4 bg-ui-muted rounded-lg">
                            <div className="flex flex-wrap gap-2">
                              {doctor.schedule_time.map((time, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-blue/10 text-blue rounded-full text-sm"
                                >
                                  {time}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
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
        title="Delete Doctor"
        description="Are you sure you want to delete this doctor? All associated data including appointments will be permanently removed. This action cannot be undone."
        confirmText="Delete Doctor"
        itemName={`Dr. ${doctor?.name}${
          doctor?.specialization ? ` (${doctor.specialization})` : ""
        }`}
      />
    </>
  );
};

export default DoctorDetailsModal;
