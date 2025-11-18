import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
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

const Detail = ({ label, value }) => (
  <div>
    <p className="text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

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
  const [filteredSlots, setFilteredSlots] = useState([]);

  const { update: updateAppointment, loading } = useCrudOperations(
    "Appointment",
    onUpdate
  );

  useEffect(() => {
    if (appointment) {
      setFormData({
        appointment_date: appointment.appointment_date?.split("T")[0] || "",
        appointment_time: appointment.appointment_time || "",
      });
      setIsEditing(false);
    }
  }, [appointment]);

  useEffect(() => {
    if (
      appointment?.doctor?.schedule_time &&
      appointment.doctor.schedule_time.length > 0
    ) {
      const slots = generateTimeSlots(appointment.doctor.schedule_time);
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [appointment?.doctor?.schedule_time]);

  useEffect(() => {
    if (!formData.appointment_date || availableSlots.length === 0) {
      setFilteredSlots([]);
      return;
    }

    const selectedDate = formData.appointment_date;
    const today = format(new Date(), "yyyy-MM-dd");

    if (selectedDate !== today) {
      setFilteredSlots(availableSlots);
      return;
    }

    const now = new Date();
    const filtered = availableSlots.filter((slot) => {
      const slotTime = new Date(`${selectedDate}T${slot.value}`);
      return slotTime > now;
    });

    setFilteredSlots(filtered);
  }, [formData.appointment_date, availableSlots]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCancelClick = () => setShowCancelModal(true);

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
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
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
                {/* PANEL */}
                <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-ui-card p-0 shadow-xl transition-all border border-ui-border overflow-hidden">
                  {/* HEADER */}
                  <header className="flex items-center justify-between px-6 py-4 border-b border-ui-border bg-ui-muted/50">
                    <Dialog.Title className="text-xl font-semibold text-foreground">
                      Appointment Details
                    </Dialog.Title>

                    <div className="flex items-center gap-2">
                      {canModify && !isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-2 rounded-xl text-muted-foreground hover:text-blue hover:bg-blue/10 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-ui-muted transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </header>

                  {/* BODY */}
                  <div className="p-6 space-y-8">
                    {/* STATUS + TIME CARD */}
                    <div className="p-4 rounded-xl bg-ui-muted/40 border border-ui-border/70 shadow-sm">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </div>

                        {/* EDIT MODE */}
                        {isEditing ? (
                          <div className="flex items-center gap-6">
                            {/* Date */}
                            <div className="flex flex-col gap-1">
                              <label className="text-xs text-muted-foreground font-medium">
                                Date
                              </label>
                              <input
                                type="date"
                                name="appointment_date"
                                value={formData.appointment_date}
                                onChange={handleInputChange}
                                min={today}
                                className="w-40 px-3 py-2 rounded-lg border border-ui-border bg-background text-sm focus:ring-2 focus:ring-blue/30 outline-none"
                              />
                            </div>

                            {/* Time */}
                            <div className="flex flex-col gap-1">
                              <label className="text-xs text-muted-foreground font-medium">
                                Time Slot
                              </label>
                              <select
                                name="appointment_time"
                                value={formData.appointment_time}
                                onChange={handleInputChange}
                                disabled={
                                  !formData.appointment_date ||
                                  filteredSlots.length === 0
                                }
                                className="w-44 px-3 py-2 rounded-lg border border-ui-border bg-background text-sm focus:ring-2 focus:ring-blue/30 outline-none disabled:bg-ui-muted/40 disabled:text-muted-foreground"
                              >
                                <option value="">Select a time slot</option>
                                {filteredSlots.map((slot) => (
                                  <option key={slot.value} value={slot.value}>
                                    {slot.display || slot.label}
                                  </option>
                                ))}
                              </select>

                              {!formData.appointment_date ? (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Select a date first
                                </p>
                              ) : filteredSlots.length === 0 ? (
                                <p className="text-xs text-red-500 mt-1">
                                  No available time slots
                                </p>
                              ) : (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {filteredSlots.length} available slot(s)
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-6 text-sm text-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue" />
                              {formatDate(appointment.appointment_date)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue" />
                              {appointment.appointment_time}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* DOCTOR & PATIENT GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl border border-ui-border bg-ui-muted/30 shadow-sm">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                          <Stethoscope className="w-5 h-5 text-blue" /> Doctor
                        </h3>
                        <div className="space-y-3 text-sm">
                          <Detail
                            label="Name"
                            value={`Dr. ${appointment.doctor?.name}`}
                          />
                          <Detail
                            label="Specialization"
                            value={appointment.doctor?.specialization}
                          />
                          <Detail
                            label="Email"
                            value={appointment.doctor?.email}
                          />
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-ui-border bg-ui-muted/30 shadow-sm">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                          <User className="w-5 h-5 text-blue" /> You
                        </h3>
                        <div className="space-y-3 text-sm">
                          <Detail
                            label="Name"
                            value={appointment.patient?.name}
                          />
                          <Detail
                            label="Email"
                            value={appointment.patient?.email}
                          />
                          {appointment.patient?.contact && (
                            <Detail
                              label="Contact"
                              value={appointment.patient.contact}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* NOTES */}
                    {appointment.notes && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Notes</h3>
                        <div className="p-4 rounded-lg bg-ui-muted/40 border border-ui-border/60 shadow-sm text-sm">
                          {appointment.notes}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FOOTER */}
                  <footer className="px-6 py-4 border-t border-ui-border bg-ui-muted/50 flex justify-between items-center">
                    {canModify && (
                      <button
                        onClick={handleCancelClick}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg border border-red-500 text-red-600 bg-red-500/5 hover:bg-red-500/15 transition disabled:opacity-50"
                      >
                        Cancel Appointment
                      </button>
                    )}

                    <div className="flex gap-3">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-5 py-2 rounded-lg border border-ui-border bg-background hover:bg-ui-muted transition"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={handleReschedule}
                            disabled={
                              loading ||
                              filteredSlots.length === 0 ||
                              !formData.appointment_time
                            }
                            className="px-5 py-2 rounded-lg bg-blue text-white hover:bg-blue/90 transition flex items-center gap-2 disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            {loading ? "Saving..." : "Save Changes"}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={onClose}
                          className="px-5 py-2 rounded-lg border border-ui-border bg-background hover:bg-ui-muted transition"
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </footer>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* CANCEL MODAL */}
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
