import { useEffect, useState } from "react";
import { api } from "@/lib/axiosHeader";
import toast from "react-hot-toast";

export const usePatientData = (userId) => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aptRes, docRes] = await Promise.all([
        api.get("/appointment/"),
        api.get("/doctor"),
      ]);
      setAppointments(aptRes.data.appointments || []);
      setDoctors(docRes.data.doctors || []);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  return { appointments, doctors, loading, refetch: fetchData };
};
