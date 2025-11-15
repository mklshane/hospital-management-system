// components/DoctorDetails.jsx
import React, { useEffect, useState } from "react";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { generateTimeSlots } from "@/utils/timeSlots";

const DoctorDetails = ({ doctor, onBook }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (doctor?.schedule_time?.length > 0) {
      const slots = generateTimeSlots(doctor.schedule_time);
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [doctor]);

  const initials = doctor
    ? doctor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  if (!doctor) {
    return (
      <div className="bg-ui-card dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400 h-full border-2">
        Select a doctor to view details
      </div>
    );
  }

  return (
    <div className="bg-ui-card dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Dr. {doctor.name}
            </h2>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {doctor.specialization}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5 flex-1">
        {/* Availability */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Availability
          </h3>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                {availableSlots.length > 0
                  ? `${availableSlots.length} slot${
                      availableSlots.length > 1 ? "s" : ""
                    } available`
                  : "No slots"}
              </span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              )}
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#fff] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot, i) => (
                    <div
                      key={i}
                      className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {slot.display || slot.label}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 italic">
                    No available time slots
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Contact
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span>{doctor.contact|| "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span>{doctor.email || "Not provided"}</span>
            </div>
           
          </div>
        </div>

      </div>

      {/* Book CTA */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-700">
        <button
          type="button"
          onClick={() => onBook(doctor)}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DoctorDetails;
