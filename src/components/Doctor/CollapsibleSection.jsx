import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

const CollapsibleSection = ({ title, badge, badgeColor = "bg-gray-400", defaultOpen = false, children }) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="border border-ui-border/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-ui-muted/30 hover:bg-ui-muted/50 transition"
      >
        <div className="flex items-center gap-3">
          <h5 className="font-medium text-foreground">{title}</h5>
          {badge && (
            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs text-white ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{open ? "Hide" : "Show"}</span>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {open && <div className="p-4 border-t border-ui-border/30">{children}</div>}
    </div>
  );
};

export default CollapsibleSection;