import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const FilterDropdown = ({
  label,
  options,
  value,
  onChange,
  onClear,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (optionValue === value) {
      onClear();
    } else {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 text-sm font-medium rounded-lg border
          transition-all duration-200 flex items-center justify-between
          bg-blue-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600
          text-gray-900 dark:text-white hover:border-blue-400 dark:hover:border-blue-600
          hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-sm hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${
            value
              ? "border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/30"
              : ""
          }
        `}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : label}
        </span>
        <div className="flex items-center gap-2 ml-2">
          {value && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            } ${
              value
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#ffff] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {/* Clear option */}
          <button
            onClick={() => {
              onClear();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-sm text-left text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600"
          >
            {label}
          </button>

          {/* Options */}
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center justify-between
                ${
                  option.value === value
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                }
              `}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
