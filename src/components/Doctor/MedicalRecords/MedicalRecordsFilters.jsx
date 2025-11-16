import { Funnel, X, Check, ChevronDown } from "lucide-react";

export const MedicalRecordsFilters = ({
  selectedFilters,
  setSelectedFilters,
  isFilterOpen,
  setIsFilterOpen,
  statusOptions,
  statusCounts,
  toggleFilter,
  alertMessage,
  setAlertMessage,
}) => (
  <>
    <div className="relative">
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="flex items-center justify-center gap-1 h-8 px-3 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted transition"
      >
        <Funnel className="w-3 h-3" />
        Filter ({selectedFilters.length})
      </button>

      {isFilterOpen && (
        <div className="absolute top-full mt-1 left-0 w-48 bg-ui-card border border-ui-border rounded-lg shadow z-50 p-2">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-semibold text-foreground">
              Select up to 3
            </p>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            {statusOptions.map((opt) => {
              const isChecked = selectedFilters.includes(opt.key);
              return (
                <label
                  key={opt.key}
                  onClick={() => toggleFilter(opt.key)}
                  className="flex items-center gap-2 p-1.5 rounded cursor-pointer hover:bg-ui-muted transition text-xs"
                >
                  <div
                    className={`w-3 h-3 rounded border flex items-center justify-center transition ${
                      isChecked ? "bg-blue border-blue" : "border-ui-border"
                    }`}
                  >
                    {isChecked && <Check className="w-2 h-2 text-white" />}
                  </div>
                  <span className="text-foreground capitalize">
                    {opt.label}
                  </span>
                  <span
                    className={`ml-auto text-xs font-medium text-${opt.color}-600`}
                  >
                    {statusCounts[opt.key]}
                  </span>
                </label>
              );
            })}
          </div>
          <div className="mt-2 pt-2 border-t border-ui-border">
            <button
              onClick={() => {
                setSelectedFilters(["recent", "older"]);
                setIsFilterOpen(false);
              }}
              className="w-full text-xs text-blue hover:underline"
            >
              Reset to default
            </button>
          </div>
        </div>
      )}
    </div>

    {alertMessage && (
      <div className="absolute top-3 right-3 z-50 max-w-xs">
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg shadow flex items-center gap-2 text-xs">
          <span className="font-medium">{alertMessage}</span>
          <button
            onClick={() => setAlertMessage("")}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    )}
  </>
);
