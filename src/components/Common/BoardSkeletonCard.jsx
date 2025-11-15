import React from "react";

const BoardSkeletonCard = () => (
  <div className="bg-ui-muted/50 backdrop-blur-sm border border-ui-border/30 rounded-xl p-3 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-ui-muted/70 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-ui-muted/60 rounded w-36 animate-pulse" />
        <div className="h-3 bg-ui-muted/50 rounded w-24 animate-pulse" />
      </div>
    </div>

    <div className="space-y-2">
      <div className="h-3 bg-ui-muted/50 rounded w-full animate-pulse" />
      <div className="h-3 bg-ui-muted/50 rounded w-32 animate-pulse" />
    </div>
  </div>
);

export default BoardSkeletonCard;
