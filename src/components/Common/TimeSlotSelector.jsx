import React from "react";
import { Clock, Trash2 } from "lucide-react";

// Generate time slots with start and end times (8:00 AM - 8:00 PM)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute of ["00", "30"]) {
      if (hour === 20 && minute === "30") break; 

      const startHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const endHour = minute === "30" ? hour : hour;
      const endMinute = minute === "00" ? "30" : "00";
      const displayEndHour =
        endHour > 12 ? endHour - 12 : endHour === 0 ? 12 : endHour;

      const period = hour < 12 ? "AM" : "PM";
      const endPeriod = endHour < 12 ? "AM" : "PM";

      const slot = {
        value: `${startHour}:${minute} ${period}`,
        display: `${startHour}:${minute} ${period} - ${displayEndHour}:${endMinute} ${endPeriod}`,
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
    let newSlots;

    if (isSelected) {
      newSlots = selectedSlots.filter((s) => s !== slot.value);
    } else {
      newSlots = [...selectedSlots, slot.value];
    }

    // Sort slots chronologically
    newSlots.sort((a, b) => {
      const getMinutes = (timeStr) => {
        const [time, period] = timeStr.split(" ");
        const [hourStr, minuteStr] = time.split(":");
        let hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);

        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;

        return hour * 60 + minute;
      };

      return getMinutes(a) - getMinutes(b);
    });

    onSlotsChange(newSlots);
  };

  const removeTimeSlot = (slotToRemove) => {
    if (disabled) return;
    const newSlots = selectedSlots.filter((slot) => slot !== slotToRemove);
    onSlotsChange(newSlots);
  };

  return (
    <div className="space-y-4">
      {/* Available Time Slots Grid */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Available Time Slots
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlots.includes(slot.value);
            return (
              <button
                key={slot.value}
                type="button"
                onClick={() => toggleTimeSlot(slot)}
                disabled={disabled}
                className={`
                  p-2 text-xs border rounded-lg transition-all duration-200 text-center
                  ${
                    isSelected
                      ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                      : "bg-ui-muted text-foreground border-ui-border hover:bg-ui-hover hover:border-blue-300"
                  }
                  ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
              >
                {slot.display}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Click on time slots to select/deselect them
        </p>
      </div>

      {/* Selected Time Slots */}
      {selectedSlots.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-foreground">
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
              return (
                <button
                  key={slotValue}
                  type="button"
                  onClick={() => removeTimeSlot(slotValue)}
                  disabled={disabled}
                  className={`
                    flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-200 group
                    ${
                      disabled
                        ? "bg-blue/20 text-blue cursor-default"
                        : "bg-blue/10 text-blue hover:bg-red-500/20 hover:text-red-500 cursor-pointer"
                    }
                  `}
                >
                  <span>{slot?.display || slotValue}</span>
                  {!disabled && (
                    <Trash2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedSlots.length === 0 && (
        <div className="p-4 text-center border border-dashed border-ui-border rounded-lg">
          <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No time slots selected. Click on the available slots above to add
            them to the schedule.
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
