import { MedicalRecordColumn } from "./MedicalRecordColumn";

export const MedicalRecordsBoard = ({
  filteredRecords,
  selectedFilters,
  statusOptions,
  sortOrders,
  toggleSort,
  onCardClick,
  selectedRecord,
  formatDate,
  columnsRefreshing,
}) => (
  <div className="grid grid-cols-3 gap-4 pb-4">
    {selectedFilters.map((filterKey) => {
      const statusData = statusOptions.find((s) => s.key === filterKey);
      const list = filteredRecords[filterKey] || [];
      const currentOrder = sortOrders[filterKey] || "desc";

      return (
        <MedicalRecordColumn
          key={filterKey}
          filterKey={filterKey}
          statusData={statusData}
          list={list}
          currentOrder={currentOrder}
          toggleSort={toggleSort}
          onCardClick={onCardClick}
          selectedRecordId={selectedRecord?._id}
          formatDate={formatDate}
          isRefreshing={columnsRefreshing}
        />
      );
    })}
  </div>
);
