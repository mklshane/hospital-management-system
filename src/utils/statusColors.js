/**
 * Returns Tailwind CSS classes for different appointment statuses
 * @param {string} status - The appointment status
 * @returns {string} Tailwind CSS classes for styling
 */
export const getStatusColor = (status) => {
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

/**
 * Alternative version for simpler status badges (like in the grid cards)
 * @param {string} status - The appointment status
 * @returns {string} Tailwind CSS classes for simpler badges
 */
export const getSimpleStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "Rejected":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Scheduled":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

/**
 * Status configuration for more complex styling needs
 * @param {string} status - The appointment status
 * @returns {object} Configuration object with color, background, and dot colors
 */
export const getStatusConfig = (status) => {
  const configs = {
    Pending: {
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      dot: "bg-yellow-500",
    },
    Scheduled: {
      color: "text-blue-600",
      bg: "bg-blue-100",
      dot: "bg-blue-500",
    },
    Completed: {
      color: "text-green-600",
      bg: "bg-green-100",
      dot: "bg-green-500",
    },
    Cancelled: {
      color: "text-gray-600",
      bg: "bg-gray-100",
      dot: "bg-gray-500",
    },
    Rejected: {
      color: "text-gray-600",
      bg: "bg-gray-100",
      dot: "bg-gray-500",
    },
  };

  return configs[status] || configs.Pending;
};

export const getSpecializationColor = (specialization) => {
  const colors = {
    Cardiology: "bg-red-600 text-white ring-red-600/20",
    Neurology: "bg-purple-600 text-white ring-purple-600/20",
    Pediatrics: "bg-pink-600 text-white ring-pink-600/20",
    Orthopedics: "bg-amber-600 text-white ring-amber-600/20",
    Dermatology: "bg-teal-600 text-white ring-teal-600/20",
    "General Medicine": "bg-blue-600 text-white ring-blue-600/20",
    Ophthalmology: "bg-indigo-600 text-white ring-indigo-600/20",
    Psychiatry: "bg-emerald-600 text-white ring-emerald-600/20",
    ENT: "bg-orange-600 text-white ring-orange-600/20",
    Radiology: "bg-cyan-600 text-white ring-cyan-600/20",
  };

  return (
    colors[specialization] ||
    "bg-gray-600 text-white ring-gray-600/20"
  );
};