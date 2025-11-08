import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = ({ appointments = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Month & Year
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  // First day of month (0 = Sun, 1 = Mon, ...)
  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  // Check if a date has appointments
  const hasAppointment = (day) => {
    const dateStr = new Date(year, currentDate.getMonth(), day)
      .toISOString()
      .split("T")[0];
    return appointments.some((apt) => {
      const aptDate = new Date(apt.appointment_date)
        .toISOString()
        .split("T")[0];
      return aptDate === dateStr;
    });
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="bg-ui-card rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 h-full flex flex-col">
      {/* Header: Month + Arrows */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
          {month} {year}
        </h3>

        <button
          onClick={nextMonth}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 flex-1 text-xs">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-start-${i}`} />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const hasAppt = hasAppointment(day);
          const today = isToday(day);

          return (
            <div
              key={day}
              className={`
                flex items-center justify-center h-8 rounded-lg transition-colors
                ${
                  today
                    ? "bg-blue-100 text-blue-700 font-bold"
                    : "text-gray-700 dark:text-gray-300"
                }
                ${
                  hasAppt
                    ? "border-2 border-blue-500"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend – Always visible, inside container */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border-2 border-blue-500 rounded" />
            <span>Appointment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-100 rounded" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
