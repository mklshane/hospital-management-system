import React from "react";
import { Clock, Trash2 } from "lucide-react";

// Generate time slots: 8:00 AM – 8:00 PM, 30-min intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute of ["00", "30"]) {
      if (hour === 20 && minute === "30") break;

      const startHour24 = hour;
      const startHour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const startPeriod = hour < 12 ? "AM" : "PM";

      let endHour24 = hour;
      let endMinute = minute === "00" ? "30" : "00";
      if (minute === "30") endHour24 += 1;

      const endHour12 =
        endHour24 > 12 ? endHour24 - 12 : endHour24 === 0 ? 12 : endHour24;
      const endPeriod = endHour24 < 12 ? "AM" : endHour24 >= 12 ? "PM" : "AM";

      const slot = {
        value: `${startHour12}:${minute} ${startPeriod}`,
        display: `${startHour12}:${minute} ${startPeriod} – ${endHour12}:${endMinute} ${endPeriod}`,
        startTime: `${hour.toString().padStart(2, "0")}:${minute}`,
      };
      slots.push(slot);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const TimeSlotSelector = ({
  selectedSlots = [],
  onSlotsChange,
  disabled = false,
}) => {
  const toggleTimeSlot = (slot) => {
    if (disabled) return;

    const isSelected = selectedSlots.includes(slot.value);
    const newSlots = isSelected
      ? selectedSlots.filter((s) => s !== slot.value)
      : [...selectedSlots, slot.value];

    // Sort chronologically
    newSlots.sort((a, b) => {
      const getMinutes = (timeStr) => {
        const [time, period] = timeStr.split(" ");
        const [h, m] = time.split(":").map(Number);
        let hour = h;
        if (period === "PM" && h !== 12) hour += 12;
        if (period === "AM" && h === 12) hour = 0;
        return hour * 60 + m;
      };
      return getMinutes(a) - getMinutes(b);
    });

    onSlotsChange(newSlots);
  };

  const removeTimeSlot = (slotValue) => {
    if (disabled) return;
    onSlotsChange(selectedSlots.filter((s) => s !== slotValue));
  };

  return (
    <div className="space-y-6">
      {/* Available Time Slots Grid */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Available Time Slots
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlots.includes(slot.value);
            return (
              <button
                key={slot.value}
                type="button"
                onClick={() => toggleTimeSlot(slot)}
                disabled={disabled}
                className={`
                  w-full px-3 py-2.5 text-xs rounded-lg border
                  text-center whitespace-nowrap transition-all duration-200
                  ${
                    isSelected
                      ? "bg-blue-500 text-white border-blue-600 shadow-sm"
                      : "bg-ui-muted text-foreground border-ui-border hover:bg-ui-hover hover:border-blue-400"
                  }
                  ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:shadow-sm"
                  }
                `}
              >
                {slot.display}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Click to select/deselect time slots
        </p>
      </div>

      {/* Selected Time Slots – Fixed Alignment */}
      {selectedSlots.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Selected Time Slots ({selectedSlots.length})
            </label>
            {!disabled && (
              <span className="text-xs text-muted-foreground">
                Click to remove
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 p-3 bg-ui-muted rounded-lg border border-ui-border min-h-12">
            {selectedSlots.map((slotValue) => {
              const slot = TIME_SLOTS.find((s) => s.value === slotValue);
              const display = slot?.display || slotValue;

              return (
                <button
                  key={slotValue}
                  type="button"
                  onClick={() => removeTimeSlot(slotValue)}
                  disabled={disabled}
                  className={`
                    group flex  items-center justify-center gap-1.5
                    w-38 px-1 py-1.5 rounded-full text-xs font-mono tracking-tighter
                    transition-all duration-200 tabular-nums 
                    ${
                      disabled
                        ? "bg-blue-100 text-blue-700 cursor-default"
                        : "bg-blue-100 text-blue-700 hover:bg-red-100 hover:text-red-700 cursor-pointer"
                    }
                  `}
                >
                  <span>{display}</span>
                  {!disabled && (
                    <Trash2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedSlots.length === 0 && (
        <div className="p-6 text-center border-2 border-dashed border-ui-border rounded-xl bg-ui-muted/50">
          <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No time slots selected yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click on the slots above to add them to your schedule.
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
