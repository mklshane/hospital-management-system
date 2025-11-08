// src/utils/timeSlots.js
/**
 * Convert 12-hour time string (e.g. "8:00 AM") to 24-hour format (e.g. "08:00")
 */
export const convertTo24Hour = (timeStr) => {
  const [time, period] = timeStr.split(" ");
  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Generate time slots from doctor's schedule_time array
 * Supports: "8:00 AM" or "8:00 AM - 8:30 AM"
 */
export const generateTimeSlots = (scheduleTimes) => {
  const slots = [];

  if (!Array.isArray(scheduleTimes) || scheduleTimes.length === 0) return slots;

  scheduleTimes.forEach((time) => {
    if (time.includes("-")) {
      const [startTime] = time.split(" - ");
      slots.push({
        value: convertTo24Hour(startTime),
        label: time,
        display: time,
      });
    } else {
      const [timeStr, period] = time.split(" ");
      const [hourStr, minuteStr] = timeStr.split(":");
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);

      let endHour = hour;
      let endMinute = minute + 30;
      let endPeriod = period;

      if (endMinute >= 60) {
        endHour += 1;
        endMinute = 0;
      }

      if (endHour === 12 && period === "AM") endPeriod = "PM";
      else if (endHour === 12 && period === "PM") endPeriod = "AM";
      else if (endHour > 12) {
        endHour -= 12;
        endPeriod = "PM";
      }

      const displayTime = `${time} - ${endHour}:${endMinute
        .toString()
        .padStart(2, "0")} ${endPeriod}`;

      const hour24 =
        period === "PM" && hour !== 12
          ? hour + 12
          : hour === 12 && period === "AM"
          ? 0
          : hour;
      const time24 = `${hour24.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      slots.push({
        value: time24,
        label: displayTime,
        display: displayTime,
      });
    }
  });

  // Sort chronologically by start time
  slots.sort((a, b) => {
    const toMins = (t) => {
      const [time, period] = t.split(" ");
      const [h, m] = time.split(":").map(Number);
      const hh =
        period === "PM" && h !== 12
          ? h + 12
          : h === 12 && period === "AM"
          ? 0
          : h;
      return hh * 60 + m;
    };
    return toMins(a.label.split(" - ")[0]) - toMins(b.label.split(" - ")[0]);
  });

  return slots;
};
