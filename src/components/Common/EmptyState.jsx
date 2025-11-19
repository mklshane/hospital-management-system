import React from "react";
import { Calendar, Stethoscope, FileText, Search, FilterX, ChevronDown} from "lucide-react";

const EmptyState = ({
  title = "No data found",
  description = "There's nothing to display here yet.",
  additionalInfo,
  icon = "default", // 'default' | 'medical' | 'search' | 'filter'
}) => {
  // Icon configurations
  const iconConfigs = {
    default: {
      main: <Calendar className="w-12 h-12 text-blue-500 dark:text-blue-400" />,
      showBadge: true,
      floating: [
        {
          icon: (
            <Stethoscope className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          ),
          position: "top-4 -left-4",
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
        },
        {
          icon: (
            <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
          ),
          position: "bottom-4 -right-4",
          bg: "bg-green-100 dark:bg-green-900/30",
        },
      ],
    },
    medical: {
      main: <FileText className="w-12 h-12 text-blue-500 dark:text-blue-400" />,
      showBadge: false,
      floating: [
        {
          icon: (
            <Stethoscope className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          ),
          position: "top-4 -left-4",
          bg: "bg-purple-100 dark:bg-purple-900/30",
        },
        {
          icon: (
            <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          ),
          position: "bottom-4 -right-4",
          bg: "bg-orange-100 dark:bg-orange-900/30",
        },
      ],
    },
    search: {
      main: <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />,
      showBadge: false,
      floating: [],
    },
    filter: {
      main: (
        <FilterX className="w-12 h-12 text-purple-500 dark:text-purple-400" />
      ),
      showBadge: true,
      floating: [
        {
          icon: (
            <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          ),
          position: "top-4 -left-4",
          bg: "bg-blue-100 dark:bg-blue-900/30",
        },
        {
          icon: (
            <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
          ),
          position: "bottom-4 -right-4",
          bg: "bg-green-100 dark:bg-green-900/30",
        },
      ],
    },
  };

  const config = iconConfigs[icon] || iconConfigs.default;

  return (
    <div className="flex flex-col items-center justify-center px-4 text-center py-12">
      {/* Animated Illustration */}
      <div className="relative mb-8">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto ${
            icon === "filter"
              ? "bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20"
              : icon === "search"
              ? "bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900/20 dark:to-blue-900/20"
              : "bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20"
          }`}
        >
          <div className="relative">
            {config.main}
            {config.showBadge && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">0</span>
              </div>
            )}
          </div>
        </div>

        {/* Floating elements */}
        {config.floating.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.position} w-8 h-8 ${item.bg} rounded-full flex items-center justify-center`}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Text Content */}
      <div className="max-w-md mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-2">{description}</p>
        {additionalInfo && (
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {additionalInfo}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
