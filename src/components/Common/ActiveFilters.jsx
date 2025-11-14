import React from "react";
import { X, FilterX } from "lucide-react";

const ActiveFilters = ({
  filters,
  filterConfig,
  onClearFilter,
  onClearAll,
}) => {
  if (Object.keys(filters).length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {/* Filter Badges */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, value]) => {
          if (!value || value === "") return null;

          const filterInfo = filterConfig[key];
          let displayValue = value;

          if (filterInfo?.options) {
            const option = filterInfo.options.find(
              (opt) => opt.value === value
            );
            displayValue = option ? option.label : value;
          }

          return (
            <div
              key={key}
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <span className="font-medium">
                {filterInfo?.label || key}: {displayValue}
              </span>
              <button
                onClick={() => onClearFilter(key)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-blue-600 transition-colors group-hover:scale-110"
                title={`Remove ${filterInfo?.label || key} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Clear All Button */}
      <button
        onClick={onClearAll}
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
        title="Clear filter"
      >
        <FilterX className="w-4 h-4" />
        <span>Clear</span>
      </button>
    </div>
  );
};

export default ActiveFilters;
