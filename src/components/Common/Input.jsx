import React from "react";

const Input = ({ label, required, className = "", error, ...props }) => (
  <div className="relative z-0">
    {label && (
      <label className="block text-sm font-medium text-foreground mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      className={`
        w-full px-4 py-3 bg-ui-muted border border-ui-border rounded-lg
        text-foreground placeholder-muted-foreground
        focus:outline-none focus:ring-2 focus:ring-blue
        focus:ring-offset-2 focus:ring-offset-ui-card
        focus:border-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error ? "border-red-500 focus:ring-red-500" : ""}
        ${className}
      `}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default Input;
