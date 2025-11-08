import { useState, useMemo } from "react";

export const useSort = (
  data,
  defaultSortField = "",
  defaultSortOrder = "asc"
) => {
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);

  const sortedData = useMemo(() => {
    if (!sortField || !data) return data;

    const sorted = [...data].sort((a, b) => {
      let aValue = getNestedValue(a, sortField);
      let bValue = getNestedValue(b, sortField);

      // Handle null/undefined values
      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      // Handle different data types
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortField, sortOrder]);

  // Updated handleSort to accept both field and order
  const handleSort = (field, order = "asc") => {
    if (field === "") {
      setSortField("");
      setSortOrder("asc");
    } else {
      setSortField(field);
      setSortOrder(order);
    }
  };

  const resetSort = () => {
    setSortField("");
    setSortOrder("asc");
  };

  return {
    sortedData,
    sortField,
    sortOrder,
    handleSort,
    resetSort,
  };
};

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};
