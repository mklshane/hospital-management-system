import { useState, useMemo } from "react";

export const useFilter = (data, filterConfig = {}) => {
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === "") return true;

        const itemValue = getNestedValue(item, key);

        // Handle different filter types
        switch (filterConfig[key]?.type) {
          case "select":
            return itemValue === value;
          case "multi-select":
            return value.includes(itemValue);
          case "date-range":
            if (!value.from || !value.to) return true;
            const itemDate = new Date(itemValue);
            return (
              itemDate >= new Date(value.from) && itemDate <= new Date(value.to)
            );
          default:
            return String(itemValue)
              .toLowerCase()
              .includes(String(value).toLowerCase());
        }
      });
    });
  }, [data, filters, filterConfig]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilter = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  return {
    filteredData,
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters: Object.keys(filters).length > 0,
  };
};

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};
