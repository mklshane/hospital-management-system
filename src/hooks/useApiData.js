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

      let result;
      if (options.dataKey && response.data[options.dataKey]) {
        result = response.data[options.dataKey];
      } else if (Array.isArray(response.data)) {
        result = response.data;
      } else if (response.data.doctors) {
        result = response.data.doctors; 
      } else if (response.data.data) {
        result = response.data.data;
      } else {
        result = response.data;
      }

      const dataArray = Array.isArray(result) ? result : [];


      setData(dataArray);
      setFilteredData(dataArray);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(err);
      toast.error(`Failed to fetch ${options.entityName || "data"}`);
      setData([]);
      setFilteredData([]);
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
