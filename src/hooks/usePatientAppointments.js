import { useEffect, useState } from "react";
import { api } from "@/lib/axiosHeader";
import toast from "react-hot-toast";

export const usePatientAppointments = (userId) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/appointment/");
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchAppointments();
  }, [userId]);

  return { appointments, loading, refetch: fetchAppointments };
};
