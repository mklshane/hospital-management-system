import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = ({ appointments = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  const hasScheduledAppointment = (day) => {
    const monthStr = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    return appointments.some((apt) => {
      const aptDate = new Date(apt.appointment_date)
        .toISOString()
        .split("T")[0];
      return aptDate === dateStr && apt.status !== "Cancelled";
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

  // Define day headers with unique keys
  const dayHeaders = [
    { key: "sun", label: "S" },
    { key: "mon", label: "M" },
    { key: "tue", label: "T" },
    { key: "wed", label: "W" },
    { key: "thu", label: "T" },
    { key: "fri", label: "F" },
    { key: "sat", label: "S" }
  ];

  return (
    <div className="bg-ui-card rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 
                    flex flex-col h-full min-h-0 overflow-hidden 
                    p-3 origin-top">

      <div className="flex items-center justify-between mb-2 px-1">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
          {month} {year}
        </h3>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        {dayHeaders.map((day) => (
          <div key={day.key} className="text-center py-1">
            {day.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1 text-xs min-h-0">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${year}-${currentDate.getMonth()}-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const hasAppt = hasScheduledAppointment(day);
          const today = isToday(day);

          return (
            <div
              key={`day-${year}-${currentDate.getMonth()}-${day}`}
              className={`
                flex items-center justify-center 
                h-7 w-7                /* ← Fixed square size (was h-8) */
                mx-auto                /* ← Centers number perfectly */
                rounded-lg transition-colors text-center
                ${today ? "bg-blue-100 text-blue-700 font-bold" : "text-gray-700 dark:text-gray-300"}
                ${hasAppt ? "border-2 border-blue-500" : "hover:bg-gray-50 dark:hover:bg-gray-700"}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border-2 border-blue-500 rounded" />
            <span>Scheduled</span>
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