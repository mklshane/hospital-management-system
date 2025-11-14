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
  XCircle,
  UserCheck,
} from "lucide-react";
import Input from "@/components/Common/Input";
import Select from "@/components/Common/Select";
import { api } from "@/lib/axiosHeader";
import DeleteModal from "@/components/Common/DeleteModal";
import toast from "react-hot-toast";
import InfoCard from "../Common/InfoCard";

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
        age: patient.age?.toString() || "",
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
      toast.success("Patient updated successfully!");
      setIsEditing(false);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update patient");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: patient.name || "",
      email: patient.email || "",
      age: patient.age?.toString() || "",
      gender: patient.gender || "",
      contact: patient.contact || "",
      address: patient.address || "",
    });
    setIsEditing(false);
  };

  const handleDeleteClick = () => setShowDeleteModal(true);
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/patient/${patient._id}`);
      toast.success("Patient deleted successfully!");
      setShowDeleteModal(false);
      onClose();
      onDelete?.();
    } catch (error) {
      toast.error("Failed to delete patient");
    }
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
            <div className="fixed inset-0 bg-blue-900/10 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-primary-foreground p-6 text-left align-middle shadow-xl transition-all border border-blue-100 dark:border-gray-700">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <Dialog.Title className="text-xl font-semibold text-primary">
                          {isEditing ? "Edit Patient" : patient.name}
                        </Dialog.Title>
                        {!isEditing && patient.email && (
                          <p className="text-sm text-gray-500 mt-1">
                            {patient.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {!isEditing && (
                        <>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleDeleteClick}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Personal Info */}
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
                            disabled
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
                          <InfoCard
                            icon={User}
                            label="Full Name"
                            value={patient.name}
                          />
                          <InfoCard
                            icon={Mail}
                            label="Email"
                            value={patient.email}
                          />
                          {patient.contact && (
                            <InfoCard
                              icon={Phone}
                              label="Contact"
                              value={patient.contact}
                            />
                          )}
                          {(patient.age || patient.gender) && (
                            <InfoCard
                              icon={Calendar}
                              label="Age & Gender"
                              value={
                                <>
                                  {patient.age && (
                                    <span>Age: {patient.age}</span>
                                  )}
                                  {patient.age && patient.gender && (
                                    <span className="mx-1">•</span>
                                  )}
                                  {patient.gender}
                                </>
                              }
                            />
                          )}
                        </>
                      )}
                    </div>

                    {/* Address */}
                    {isEditing ? (
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-3 py-2 bg-ui-card border border-gray-300 rounded-lg text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                          placeholder="Enter patient's full address"
                        />
                      </div>
                    ) : patient.address ? (
                    
                      <InfoCard
                              icon={MapPin}
                              label="Address"
                              value={patient.address}
                            />
                    ) : null}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          {loading ? (
                            "Saving..."
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={onClose}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
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

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        description="This will permanently remove the patient and all associated appointments."
        confirmText="Delete Patient"
        itemName={patient.name}
      />
    </>
  );
};

export default PatientDetailsModal;
