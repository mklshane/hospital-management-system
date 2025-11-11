import { useState } from "react";
import { api } from "@/lib/axiosHeader";
import toast from "react-hot-toast";

export const useCrudOperations = (entityName, refetch) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const create = async (data, endpoint) => {
    setLoading(true);
    try {
      await api.post(endpoint, data);
      toast.success(`${entityName} created successfully!`);
      refetch?.();
      return true;
    } catch (error) {
      console.error(`Error creating ${entityName}:`, error);

      // Extract meaningful error message
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        `Failed to create ${entityName}`;

      toast.error(errorMessage); // Now shows exact reason!
      return false;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, data, endpoint) => {
    setLoading(true);
    try {
      const url = endpoint.includes(id) ? endpoint : `${endpoint}/${id}`;
      await api.put(url, data);
      toast.success(`${entityName} updated successfully!`);
      refetch?.();
      return true;
    } catch (error) {
      console.error(`Error updating ${entityName}:`, error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        `Failed to update ${entityName}`;

      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id, endpoint) => {
    setDeleteLoading(true);
    try {
      await api.delete(`${endpoint}/${id}`);
      toast.success(`${entityName} deleted successfully!`);
      refetch?.();
      return true;
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        `Failed to delete ${entityName}`;

      toast.error(errorMessage);
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    loading,
    deleteLoading,
    create,
    update,
    deleteItem,
  };
};
