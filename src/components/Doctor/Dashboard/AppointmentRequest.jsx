import AppointmentRequestCard from "./AppointmentRequestCard";

import { AlertCircle } from "lucide-react";
const AppointmentRequests = ({
  requests,
  loading,
  actionLoading,
  onStatusUpdate,
}) => {
  const EmptyPlaceholder = () => (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="w-16 h-16 bg-ui-muted rounded-full flex items-center justify-center mb-3">
        <AlertCircle className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">
        No Pending Requests
      </h3>
      <p className="text-xs text-muted-foreground">
        All appointment requests have been processed.
      </p>
    </div>
  );

  return (
    <div className="col-span-3 row-span-2 flex flex-col overflow-hidden bg-ui-card border-2 rounded-xl h-[623px]">
      <div className="p-3 border-b border-ui-border shrink-0">
        <h2 className="text-base font-semibold text-foreground font-montserrat">
          Appointment Requests
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-ui-muted/50 border rounded-lg p-3 animate-pulse space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-ui-muted/70 animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-ui-muted/60 rounded w-24 animate-pulse" />
                    <div className="h-2 bg-ui-muted/50 rounded w-16 animate-pulse" />
                  </div>
                </div>
                <div className="h-8 bg-ui-muted/60 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          requests.map((req) => (
            <AppointmentRequestCard
              key={req._id}
              request={req}
              onApprove={(id) => onStatusUpdate(id, "Scheduled")}
              onReject={(id) => onStatusUpdate(id, "Rejected")}
              loading={actionLoading[req._id]}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentRequests;
