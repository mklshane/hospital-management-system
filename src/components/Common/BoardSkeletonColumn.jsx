import React from "react";
import BoardSkeletonCard from "./BoardSkeletonCard";

const BoardSkeletonColumn = ({ label, color = "gray" }) => {
  const randomCount = Math.floor(Math.random() * 6) + 1;
  const randomCards = Math.floor(Math.random() * 4) + 3;

  const topBarColor =
    {
      yellow: "bg-yellow-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
      gray: "bg-gray-400",
    }[color] || "bg-gray-400";

  return (
    <div className="relative min-h-0 flex flex-col bg-ui-surface/30 rounded-lg p-2 border border-ui-border/20">
      {/* Colored top bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${topBarColor}`} />

      <h2 className="flex items-center gap-1 text-sm font-semibold mb-2 text-foreground sticky top-0 bg-ui-surface z-10 py-1 px-1 rounded">
        {label} ({randomCount})
        <svg
          className="w-3 h-3 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16l-4-4m0 0l4-4m-4 4h18"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </h2>

      <div className="space-y-2">
        {[...Array(randomCards)].map((_, i) => (
          <BoardSkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default BoardSkeletonColumn;
