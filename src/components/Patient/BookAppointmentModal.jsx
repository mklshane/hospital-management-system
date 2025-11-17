import { X } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { generateTimeSlots } from "@/utils/timeSlots";

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
  const [filteredSlots, setFilteredSlots] = useState([]); // slots after filtering past times

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSelectedDoctor(null);
      setAvailableSlots([]);
      setFilteredSlots([]);
    }
  }, [isOpen]);

  // Sync selected doctor from form
  useEffect(() => {
    if (form.doctor_id) {
      const doctor = doctors.find((doc) => doc._id === form.doctor_id);
      setSelectedDoctor(doctor);
    } else {
      setSelectedDoctor(null);
      setAvailableSlots([]);
      setFilteredSlots([]);
    }
  }, [form.doctor_id, doctors]);

  // Generate base slots from doctor's schedule
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
      setFilteredSlots([]);
    }
  }, [selectedDoctor]);

  // Helper: parse date + time string → Date object (same logic as BookingCard)
  const parseDateTime = (date, time) => {
    return new Date(`${date}T${time}`);
  };

  // Filter out past time slots when date is today
  useEffect(() => {
    if (!form.appointment_date || availableSlots.length === 0) {
      setFilteredSlots([]);
      return;
    }

    const selectedDate = form.appointment_date;
    const today = format(new Date(), "yyyy-MM-dd");

    if (selectedDate !== today) {
      // Not today → all slots are allowed
      setFilteredSlots(availableSlots);
      return;
    }

    // Today → filter out past slots
    const now = new Date();
    const filtered = availableSlots.filter((slot) => {
      // slot.value is like "09:00:00"
      const slotTime = parseDateTime(selectedDate, slot.value);
      return slotTime > now;
    });

    setFilteredSlots(filtered);
  }, [form.appointment_date, availableSlots]);

  const handleDoctorChange = (e) => {
    onChange(e);
    // Clear date & time when doctor changes
    onChange({ target: { name: "appointment_date", value: "" } });
    onChange({ target: { name: "appointment_time", value: "" } });
  };

  const handleDateChange = (e) => {
    onChange(e);
    // Clear time when date changes
    onChange({ target: { name: "appointment_time", value: "" } });
  };

  if (!isOpen) return null;

  // Determine if time slot should be disabled
  const isTimeSlotDisabled = !selectedDoctor || !form.appointment_date;

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
          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Select Doctor <span className="text-red-500">*</span>
            </label>
            <select
              name="doctor_id"
              value={form.doctor_id || ""}
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

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="appointment_date"
              value={form.appointment_date || ""}
              onChange={handleDateChange}
              min={format(new Date(), "yyyy-MM-dd")}
              disabled={!form.doctor_id}
              className="w-full border border-gray-300 bg-primary-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Time Slot <span className="text-red-500">*</span>
            </label>

            {isTimeSlotDisabled ? (
              <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-500 bg-gray-50">
                {form.doctor_id
                  ? !form.appointment_date
                    ? "Please select a date first"
                    : "Loading available slots..."
                  : "Please select a doctor first"}
              </div>
            ) : filteredSlots.length > 0 ? (
              <select
                name="appointment_time"
                value={form.appointment_time || ""}
                onChange={onChange}
                className="w-full border border-gray-300 bg-primary-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a time slot</option>
                {filteredSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.display || slot.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-500 bg-gray-50">
                No available time slots for the selected date
              </div>
            )}

            {selectedDoctor && form.appointment_date && filteredSlots.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {filteredSlots.length} available slot(s) for Dr. {selectedDoctor.name}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={form.notes || ""}
              onChange={onChange}
              rows={3}
              className="w-full border border-gray-300 bg-primary-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Persistent cough, mild fever"
            />
          </div>

          {/* Actions */}
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
              disabled={
                submitting ||
                !form.doctor_id ||
                !form.appointment_date ||
                !form.appointment_time ||
                filteredSlots.length === 0
              }
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