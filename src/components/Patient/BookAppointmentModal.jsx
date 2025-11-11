import { X } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { generateTimeSlots, convertTo24Hour } from "@/utils/timeSlots";

export default function BookAppointmentModal({
  isOpen,
  onClose,
  doctors,
  form,
  onChange,
  onSubmit,
  submitting,
}) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedDoctor(null);
      setAvailableSlots([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (form.doctor_id) {
      const doctor = doctors.find((doc) => doc._id === form.doctor_id);
      setSelectedDoctor(doctor);
    } else {
      setSelectedDoctor(null);
      setAvailableSlots([]);
    }
  }, [form.doctor_id, doctors]);

  // Generate available time slots based on doctor's schedule
  useEffect(() => {
    if (
      selectedDoctor &&
      selectedDoctor.schedule_time &&
      selectedDoctor.schedule_time.length > 0
    ) {
      const slots = generateTimeSlots(selectedDoctor.schedule_time);
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor]);


  const handleDoctorChange = (e) => {
    onChange(e); 
  };

  const handleTimeChange = (e) => {
    onChange(e);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-ui-card border-2 rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">
            Book New Appointment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Select Doctor <span className="text-red-500">*</span>
            </label>
            <select
              name="doctor_id"
              value={form.doctor_id}
              onChange={handleDoctorChange}
              className="w-full border border-gray-300 bg-primary-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Choose a doctor --</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  Dr. {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="appointment_date"
              value={form.appointment_date}
              onChange={onChange}
              min={format(new Date(), "yyyy-MM-dd")}
              className="w-full border border-gray-300 bg-primary-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Time Slot <span className="text-red-500">*</span>
            </label>
            {availableSlots.length > 0 ? (
              <select
                name="appointment_time"
                value={form.appointment_time}
                onChange={handleTimeChange}
                className="w-full border border-gray-300 bg-primary-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Select a time slot --</option>
                {availableSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.display || slot.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                {form.doctor_id
                  ? "No available time slots for this doctor"
                  : "Please select a doctor first"}
              </div>
            )}
            {selectedDoctor && availableSlots.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {availableSlots.length} available slot(s) based on Dr.{" "}
                {selectedDoctor.name}'s schedule
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={onChange}
              rows={3}
              className="w-full border border-gray-300 bg-primary-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Persistent cough, mild fever"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-primary py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || availableSlots.length === 0}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
