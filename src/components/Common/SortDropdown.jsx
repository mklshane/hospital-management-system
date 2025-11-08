import React from "react";

const SortDropdown = ({
  sortOptions,
  sortField,
  sortOrder,
  onSort,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={sortField || ""}
        onChange={(e) => {
          if (e.target.value) {
            onSort(e.target.value);
          }
        }}
        className="appearance-none bg-ui-surface border border-ui-border rounded-lg px-4 py-2 pr-8 text-foreground focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent cursor-pointer"
      >
        <option value="">Sort by</option>
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {sortField && (
        <button
          onClick={() => onSort(sortField)}
          className="ml-2 p-1 text-muted-foreground hover:text-foreground transition"
          title={sortOrder === "asc" ? "Sort descending" : "Sort ascending"}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sortOrder === "asc" ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            )}
          </svg>
        </button>
      )}
    </div>
  );
};

export default SortDropdown;
