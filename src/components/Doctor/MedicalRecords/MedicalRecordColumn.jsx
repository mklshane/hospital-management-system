import { ArrowUpDown } from "lucide-react";
import MedicalRecordCard from "./MedicalRecordCard";
import BoardSkeletonColumn from "@/components/Common/BoardSkeletonColumn";

export const MedicalRecordColumn = ({
  filterKey,
  statusData,
  list,
  currentOrder,
  toggleSort,
  onCardClick,
  selectedRecordId,
  formatDate,
  isRefreshing,
}) => (
  <div className="relative min-h-0 flex flex-col bg-ui-surface/30 rounded-b-lg p-2 border border-ui-border/20">
    <div
      className={`absolute top-0 left-0 right-0 h-0.5 ${
        statusData.color === "blue"
          ? "bg-blue-500"
          : statusData.color === "green"
          ? "bg-green-500"
          : "bg-gray-400"
      }`}
    />
    <h2
      onClick={() => toggleSort(filterKey)}
      className="flex items-center gap-1 text-sm font-semibold mb-2 text-foreground cursor-pointer hover:text-blue transition select-none sticky top-0 bg-ui-card z-10 py-1 px-1 rounded"
    >
      {statusData.label} ({list.length})
      <ArrowUpDown
        className={`w-3 h-3 transition-all ${
          currentOrder === "asc"
            ? "rotate-180 text-blue"
            : "text-muted-foreground"
        }`}
      />
    </h2>

    <div className="space-y-2 flex-1 overflow-y-auto pr-1">
      {isRefreshing ? (
        <BoardSkeletonColumn
          label={statusData.label}
          color={statusData.color}
        />
      ) : list.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-8">
          No {statusData.label.toLowerCase()} records
        </p>
      ) : (
        list.map((record) => (
          <MedicalRecordCard
            key={record._id}
            record={record}
            onClick={() => onCardClick(record)}
            formatDate={formatDate}
            isSelected={selectedRecordId === record._id}
          />
        ))
      )}
    </div>
  </div>
);
