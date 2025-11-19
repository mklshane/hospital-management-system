import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const StatusDropdown = ({ value, onChange, className = "" }) => {
  const options = ["All", "Scheduled", "Pending", "Completed", "Rejected"];
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-4 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-base font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300 ml-2" />
      </button>

      {open && (
        <ul className="absolute right-0 mt-2 w-28 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1 text-base">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full flex items-center h-10 text-left px-3 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                  opt === value ? "bg-gray-100 dark:bg-gray-600" : ""
                } text-gray-900 dark:text-white text-base font-normal`}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StatusDropdown;
