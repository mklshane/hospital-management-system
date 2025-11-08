import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  X,
  Mail,
  Phone,
  User,
  Clock,
  Stethoscope,
  Calendar,
  Save,
  Edit2,
  Trash2,
  Check,
  XCircle,
} from "lucide-react";
import Input from "@/components/Common/Input";
import Select from "@/components/Common/Select";
import TimeSlotSelector from "@/components/Common/TimeSlotSelector";
import { api } from "@/lib/axiosHeader";
import DeleteModal from "@/components/Common/DeleteModal";
import toast from "react-hot-toast";
import InfoCard from "../Common/InfoCard";

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
  const [scheduleTime, setScheduleTime] = useState([]);

  const genders = ["Male", "Female", "Other"];

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || "",
        email: doctor.email || "",
        age: doctor.age?.toString() || "",
        gender: doctor.gender || "",
        contact: doctor.contact || "",
        specialization: doctor.specialization || "",
      });
      setScheduleTime(doctor.schedule_time || []);
    }
    setIsEditing(false);
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (scheduleTime.length === 0) {
      toast.error("Please select at least one time slot");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, schedule_time: scheduleTime };
      await api.put(`/doctor/${doctor._id}`, payload);
      toast.success("Doctor updated successfully!");
      setIsEditing(false);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update doctor");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: doctor.name || "",
      email: doctor.email || "",
      age: doctor.age?.toString() || "",
      gender: doctor.gender || "",
      contact: doctor.contact || "",
      specialization: doctor.specialization || "",
    });
    setScheduleTime(doctor.schedule_time || []);
    setIsEditing(false);
  };

  const handleDeleteClick = () => setShowDeleteModal(true);
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/doctor/${doctor._id}`);
      toast.success("Doctor deleted successfully!");
      setShowDeleteModal(false);
      onClose();
      onDelete?.();
    } catch (error) {
      toast.error("Failed to delete doctor");
    }
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
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-ui-card p-6 text-left align-middle shadow-2xl transition-all border border-gray-200 dark:border-gray-700">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
                          {isEditing ? "Edit Doctor" : `Dr. ${doctor.name}`}
                        </Dialog.Title>
                        {!isEditing && doctor.specialization && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {doctor.specialization}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isEditing && (
                        <>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-xl transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleDeleteClick}
                            className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={onClose}
                        className="p-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-xl transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* === Personal Info === */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                            placeholder="e.g. 45"
                          />
                          <Select
                            label="Specialization"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            options={SPECIALIZATIONS}
                            required
                          />
                        </>
                      ) : (
                        <>
                          <InfoCard
                            icon={User}
                            label="Full Name"
                            value={`Dr. ${doctor.name}`}
                          />
                          <InfoCard
                            icon={Mail}
                            label="Email"
                            value={doctor.email}
                          />
                          {doctor.contact && (
                            <InfoCard
                              icon={Phone}
                              label="Contact"
                              value={doctor.contact}
                            />
                          )}
                          {(doctor.age || doctor.gender) && (
                            <InfoCard
                              icon={User}
                              label="Age & Gender"
                              value={
                                <>
                                  {doctor.age && <span>Age: {doctor.age}</span>}
                                  {doctor.age && doctor.gender && (
                                    <span className="mx-1">•</span>
                                  )}
                                  {doctor.gender}
                                </>
                              }
                            />
                          )}
                          {doctor.specialization && (
                            <InfoCard
                              icon={Stethoscope}
                              label="Specialization"
                              value={doctor.specialization}
                            />
                          )}
                        </>
                      )}
                    </div>

                    {/* === Schedule === */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Available Schedule
                        {scheduleTime.length > 0 && (
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            ({scheduleTime.length} slots)
                          </span>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                          <TimeSlotSelector
                            selectedSlots={scheduleTime}
                            onSlotsChange={setScheduleTime}
                          />
                        </div>
                      ) : (
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                          {scheduleTime.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {scheduleTime.map((slot, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-full"
                                >
                                  <Clock className="w-3 h-3" />
                                  {slot}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-3">
                              No schedule configured
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* === Actions === */}
                  <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
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
                          disabled={loading || scheduleTime.length === 0}
                          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {loading ? (
                            <>Saving...</>
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

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Doctor"
        description="This will permanently remove the doctor and all associated appointments."
        confirmText="Delete Doctor"
        itemName={`Dr. ${doctor.name}`}
      />
    </>
  );
};

export default DoctorDetailsModal;
