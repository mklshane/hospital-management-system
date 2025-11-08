import { useState, useMemo } from "react";

export const useSearch = (data, searchFields = []) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase().trim();
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = getNestedValue(item, field);
        return value?.toString().toLowerCase().includes(query);
      })
    );
  }, [data, searchQuery, searchFields]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return {
    searchQuery,
    filteredData,
    handleSearch,
    setSearchQuery,
  };
};

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};
