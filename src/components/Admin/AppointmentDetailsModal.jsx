import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Trash2,
} from "lucide-react";
import { api } from "@/lib/axiosHeader";

const AppointmentDetailsModal = ({
  isOpen,
  onClose,
  appointment,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Completed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Rejected":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this appointment?`)) {
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/appointment/${appointment._id}`);
      alert("Appointment deleted successfully!");
      onClose();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment");
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) return null;

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
              <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-ui-card p-6 shadow-xl transition-all border border-ui-border">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-bold text-foreground">
                    Appointment Details
                  </Dialog.Title>
                  <div className="flex items-center gap-2">
                  
                    <button
                      onClick={onClose}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Appointment Information */}
                <div className="space-y-6">
                  {/* Status and Basic Info */}
                  <div className="flex items-center gap-4 p-4 bg-ui-muted rounded-lg">
                    <div
                      className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="w-4 h-4 text-blue" />
                        <span>{formatDate(appointment.appointment_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <Clock className="w-4 h-4 text-blue" />
                        <span>{appointment.appointment_time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Doctor and Patient Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Doctor Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-blue" />
                        Doctor Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="text-foreground font-medium">
                            Dr. {appointment.doctor?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Specialization
                          </p>
                          <p className="text-foreground font-medium">
                            {appointment.doctor?.specialization}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="text-foreground font-medium">
                            {appointment.doctor?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Patient Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <User className="w-5 h-5 text-blue" />
                        Patient Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="text-foreground font-medium">
                            {appointment.patient?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="text-foreground font-medium">
                            {appointment.patient?.email}
                          </p>
                        </div>
                        {appointment.patient?.contact && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Contact
                            </p>
                            <p className="text-foreground font-medium">
                              {appointment.patient.contact}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {appointment.notes && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        Appointment Notes
                      </h3>
                      <div className="p-4 bg-ui-muted rounded-lg">
                        <p className="text-foreground">{appointment.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Appointment Metadata */}
                  <div className="pt-4 border-t border-ui-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Appointment Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-ui-muted rounded-lg">
                        <p className="text-muted-foreground">Appointment ID</p>
                        <p className="text-foreground font-mono text-xs">
                          {appointment._id}
                        </p>
                      </div>
                      <div className="p-3 bg-ui-muted rounded-lg">
                        <p className="text-muted-foreground">Created On</p>
                        <p className="text-foreground">
                          {appointment.createdAt
                            ? new Date(
                                appointment.createdAt
                              ).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-ui-border">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 border border-ui-border text-foreground rounded-lg hover:bg-ui-muted transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {loading ? "Deleting..." : "Delete Appointment"}
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

export default AppointmentDetailsModal;
