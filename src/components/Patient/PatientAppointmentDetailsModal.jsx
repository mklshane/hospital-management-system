import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Edit2,
  Save,
} from "lucide-react";
import { getStatusColor } from "@/utils/statusColors";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import toast from "react-hot-toast";
import DeleteModal from "../Common/DeleteModal";
import { generateTimeSlots } from "@/utils/timeSlots";
import { format } from "date-fns";

const PatientAppointmentDetailsModal = ({
  isOpen,
  onClose,
  appointment,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formData, setFormData] = useState({
    appointment_date: "",
    appointment_time: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);

  const { update: updateAppointment, loading } = useCrudOperations(
    "Appointment",
    onUpdate
  );

  // Reset form when appointment changes
  useEffect(() => {
    if (appointment) {
      setFormData({
        appointment_date: appointment.appointment_date?.split("T")[0] || "",
        appointment_time: appointment.appointment_time || "",
      });
      setIsEditing(false);
    }
  }, [appointment]);

  // Generate available time slots based on doctor's schedule
  useEffect(() => {
    if (
      isEditing &&
      appointment?.doctor &&
      appointment.doctor.schedule_time &&
      appointment.doctor.schedule_time.length > 0
    ) {
      const slots = generateTimeSlots(appointment.doctor.schedule_time);
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [isEditing, appointment?.doctor]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    const success = await updateAppointment(
      appointment._id,
      { status: "Cancelled" },
      `/appointment/${appointment._id}`
    );
    if (success) {
      setShowCancelModal(false);
      onClose();
    }
  };

  const handleReschedule = async () => {
    if (!formData.appointment_date || !formData.appointment_time) {
      toast.error("Please select both date and time");
      return;
    }

    const success = await updateAppointment(
      appointment._id,
      {
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
      },
      `/appointment/${appointment._id}`
    );

    if (success) {
      setIsEditing(false);
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const canModify =
    appointment?.status === "Pending" || appointment?.status === "Scheduled";
  const today = new Date().toISOString().split("T")[0];

  if (!appointment) return null;

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
                      Appointment Details
                    </Dialog.Title>
                    <div className="flex items-center gap-2">
                      {canModify && !isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-2 text-muted-foreground hover:text-blue hover:bg-blue/10 rounded-lg transition-colors"
                          title="Reschedule"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-6">
                    {/* Status + Date/Time */}
                    <div className="flex items-center justify-between p-4 bg-ui-muted rounded-lg">
                      <div
                        className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-muted-foreground">
                              Date
                            </label>
                            <input
                              type="date"
                              name="appointment_date"
                              value={formData.appointment_date}
                              onChange={handleInputChange}
                              min={today}
                              className="px-2 py-1 border border-ui-border rounded text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-muted-foreground">
                              Time Slot
                            </label>
                            {availableSlots.length > 0 ? (
                              <select
                                name="appointment_time"
                                value={formData.appointment_time}
                                onChange={handleInputChange}
                                className="px-2 py-1 border border-ui-border rounded text-sm w-44"
                                required
                              >
                                <option value="">Select a time slot</option>
                                {availableSlots.map((slot) => (
                                  <option key={slot.value} value={slot.value}>
                                    {slot.display || slot.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="px-2 py-1 text-xs text-gray-500 bg-gray-50 rounded border w-44">
                                No available time slots
                              </div>
                            )}
                            {availableSlots.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {availableSlots.length} available slot(s)
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-foreground">
                            <Calendar className="w-4 h-4 text-blue" />
                            <span>
                              {formatDate(appointment.appointment_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-foreground">
                            <Clock className="w-4 h-4 text-blue" />
                            <span>{appointment.appointment_time}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Doctor & Patient Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-blue" />
                          Doctor
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Name</p>
                            <p className="font-medium">
                              Dr. {appointment.doctor?.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Specialization
                            </p>
                            <p className="font-medium">
                              {appointment.doctor?.specialization}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">
                              {appointment.doctor?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <User className="w-5 h-5 text-blue" />
                          You
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Name</p>
                            <p className="font-medium">
                              {appointment.patient?.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">
                              {appointment.patient?.email}
                            </p>
                          </div>
                          {appointment.patient?.contact && (
                            <div>
                              <p className="text-muted-foreground">Contact</p>
                              <p className="font-medium">
                                {appointment.patient.contact}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="pt-4 border-t border-ui-border">
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          Notes
                        </h3>
                        <div className="p-3 bg-ui-muted rounded-lg">
                          <p className="text-foreground">{appointment.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-ui-border">
                    <div>
                      {canModify && (
                        <button
                          onClick={handleCancelClick}
                          disabled={loading}
                          className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors font-medium disabled:opacity-50"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-5 py-2 border border-ui-border text-foreground rounded-lg hover:bg-ui-muted transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleReschedule}
                            disabled={loading || availableSlots.length === 0}
                            className="px-5 py-2 bg-blue hover:bg-blue/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            {loading ? "Saving..." : "Save Changes"}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={onClose}
                          className="px-5 py-2 border border-ui-border text-foreground rounded-lg hover:bg-ui-muted transition-colors"
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

      {/* ── DELETE CONFIRMATION MODAL ── */}
      <DeleteModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="No, Keep It"
        loading={loading}
        itemName={`Appointment on ${formatDate(
          appointment.appointment_date
        )} at ${appointment.appointment_time}`}
      />
    </>
  );
};

export default PatientAppointmentDetailsModal;
