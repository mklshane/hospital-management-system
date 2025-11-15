import React from "react";
import { Phone } from "lucide-react";

const DoctorCard = ({ doctor, onBook, onViewDetails }) => {
  const initials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-slate-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold text-sm">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            Dr. {doctor.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {doctor.specialization}
          </p>

          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">
            <Phone className="w-3 h-3" />
            <span>{doctor.contact}</span>
          </div>

        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onBook(doctor)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white text-sm font-medium py-2 rounded-lg transition"
        >
          Book Now
        </button>

        {/* Details*/}
        <button
          onClick={() => onViewDetails(doctor)}
          className="flex-1 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 text-sm font-medium py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition"
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
