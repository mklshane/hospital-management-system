import React from "react";
import { Phone } from "lucide-react";
import { getSpecializationColor } from "@/utils/statusColors";

const DoctorCard = ({ doctor, onViewDetails }) => {
  const initials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatarColor = getSpecializationColor(doctor.specialization);

  return (
    <div className="bg-[#ffff] dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Only the avatar is colored — rest is neutral */}
        <div
          className={`w-12 h-12 ${avatarColor} rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-inset shadow-sm`}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            Dr. {doctor.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            {doctor.specialization}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-2">
            <Phone className="w-3.5 h-3.5" />
            <span>{doctor.contact}</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => onViewDetails(doctor)}
          className="w-full text-blue-600 bg-blue-50 dark:text-blue-400 border border-blue-700 hover:bg-blue-100 dark:bg-transparent dark:hover:bg-blue-900/20 font-medium text-sm py-1.75 rounded-lg transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
