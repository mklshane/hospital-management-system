import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const CollapsibleSection = ({
  title,
  badge,
  badgeColor = "bg-gray-400",
  defaultOpen = false,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState(defaultOpen ? "auto" : "0px");
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setHeight(open ? `${ref.current.scrollHeight}px` : "0px");
    }
  }, [open, children]);

  return (
    <div className="border-t border-ui-border/50 first:border-t-0">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between pt-2 text-left hover:bg-ui-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1">
          <h5 className="font-medium text-foreground text-sm">{title}</h5>
          {badge && (
            <span
              className={`flex items-center justify-center w-5 h-5 rounded-full text-xs text-white font-medium ${badgeColor}`}
            >
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {open ? "Hide" : "Show"}
          </span>
          {open ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expandable Content with Animation */}
      <div
        ref={ref}
        style={{
          height,
          transition: "height 0.3s ease",
        }}
        className="overflow-hidden px-0"
      >
        <div className="pb-4 pt-2">{children}</div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
