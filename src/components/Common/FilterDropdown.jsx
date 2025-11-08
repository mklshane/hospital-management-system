import React from "react";

const FilterDropdown = ({
  label,
  options,
  value,
  onChange,
  onClear,
  type = "select",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value || ""}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue === "") {
            onClear();
          } else {
            onChange(newValue);
          }
        }}
        className="appearance-none bg-ui-surface border border-ui-border rounded-lg px-4 py-2 pr-8 text-foreground focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent cursor-pointer w-full"
      >
        <option value="">{label}</option>
        {options.map((option) => (
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
    </div>
  );
};

export default FilterDropdown;
