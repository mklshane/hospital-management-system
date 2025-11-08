import React from "react";

const ActiveFilters = ({
  filters,
  filterConfig,
  onClearFilter,
  onClearAll,
}) => {
  if (Object.keys(filters).length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {Object.entries(filters).map(([key, value]) => {
        if (!value || value === "") return null;

        const filterInfo = filterConfig[key];
        let displayValue = value;

        if (filterInfo?.options) {
          const option = filterInfo.options.find((opt) => opt.value === value);
          displayValue = option ? option.label : value;
        }

        return (
          <span
            key={key}
            className="inline-flex items-center gap-1 bg-blue/10 text-blue px-3 py-1 rounded-full text-sm"
          >
            <span className="font-medium">{filterInfo?.label || key}:</span>
            {displayValue}
            <button
              onClick={() => onClearFilter(key)}
              className="hover:text-blue/70 transition"
            >
              ×
            </button>
          </span>
        );
      })}
      <button
        onClick={onClearAll}
        className="text-muted-foreground hover:text-foreground text-sm underline transition"
      >
        Clear all
      </button>
    </div>
  );
};

export default ActiveFilters;
