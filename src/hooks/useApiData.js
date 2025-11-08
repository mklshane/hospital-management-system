import { useState, useEffect } from "react";
import { api } from "@/lib/axiosHeader";
import toast from "react-hot-toast";

export const useApiData = (endpoint, options = {}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(endpoint);
      const result = response.data[options.dataKey] || response.data;
      setData(result);
      setFilteredData(result);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(err);
      toast.error(`Failed to fetch ${options.entityName || "data"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    filteredData,
    setFilteredData,
    loading,
    error,
    refetch,
  };
};
