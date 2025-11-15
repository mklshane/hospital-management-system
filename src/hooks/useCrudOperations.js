import { useState } from "react";
import { api } from "@/lib/axiosHeader";
import toast from "react-hot-toast";

/**
 * Enhanced CRUD hook with precise toast messages.
 *
 * @param {string} entityName
 * @param {Function} refetch
 */
export const useCrudOperations = (entityName, refetch) => {
  // global loading (create / generic update)
  const [loading, setLoading] = useState(false);
  // delete loading (still per-item)
  const [deleteLoading, setDeleteLoading] = useState(false);
  // per-action loading for updates (accept/reject/cancel)
  const [actionLoading, setActionLoading] = useState({});

  const getActionVerb = (data) => {
    if (!data) return "updated";

    // Appointment status changes
    if (entityName === "Appointment" && data.status) {
      const s = data.status.toLowerCase().trim();
      if (["scheduled", "accepted"].includes(s)) return "accepted";
      if (s === "rejected") return "declined";
      if (s === "cancelled") return "cancelled";
      if (s === "completed") return "marked as completed";
    }

    // Generic verbs
    return "updated";
  };

  // --------------------------------------------------------------------- //
  // CREATE
  // --------------------------------------------------------------------- //
  const create = async (data, endpoint) => {
    setLoading(true);
    try {
      await api.post(endpoint, data);
      toast.success(`${entityName} created successfully!`);
      refetch?.();
      return true;
    } catch (error) {
      const msg =
        error.response?.data?.message || `Failed to create ${entityName}`;
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, data, endpoint) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const url = endpoint.includes(id) ? endpoint : `${endpoint}/${id}`;
      await api.put(url, data);

      const verb = getActionVerb(data);
      toast.success(`${entityName} ${verb} successfully!`);
      refetch?.();
      return true;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        `Failed to ${getActionVerb(data)} ${entityName}`;
      toast.error(msg);
      return false;
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
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
      const msg =
        error.response?.data?.message || `Failed to delete ${entityName}`;
      toast.error(msg);
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    loading,
    deleteLoading,
    actionLoading,
    create,
    update,
    deleteItem,
  };
};
