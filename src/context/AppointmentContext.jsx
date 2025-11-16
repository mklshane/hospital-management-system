import React, { createContext, useContext, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApiData } from "@/hooks/useApiData";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import { useSearch } from "@/hooks/useSearch";
import { useFilter } from "@/hooks/useFilter";
import { useSort } from "@/hooks/useSort";

const AppointmentContext = createContext();

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error(
      "useAppointment must be used within an AppointmentProvider"
    );
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const { user } = useAuth();

  // Only fetch data if user is authenticated
  const shouldFetchData = !!user;

  // Determine which endpoints to fetch based on user role
  const getAppointmentEndpoint = () =>
    shouldFetchData ? "/appointment" : null;
  const getDoctorEndpoint = () =>
    shouldFetchData && user?.role !== "doctor" ? "/doctor" : null;
  const getPatientEndpoint = () =>
    shouldFetchData && user?.role !== "patient" ? "/patient" : null;

  // Fetch appointments with role-based automatic filtering
  const {
    data: appointments,
    filteredData: filteredAppointments,
    loading: appointmentsLoading,
    refetch: refetchAppointments,
  } = useApiData(getAppointmentEndpoint(), {
    entityName: "appointments",
    dataKey: "appointments",
  });

  // Fetch doctors (for admin and patient)
  const {
    data: doctors,
    loading: doctorsLoading,
    refetch: refetchDoctors,
  } = useApiData(getDoctorEndpoint(), {
    entityName: "doctors",
    dataKey: "doctors",
  });

  // Fetch patients (for admin and doctor)
  const {
    data: patients,
    loading: patientsLoading,
    refetch: refetchPatients,
  } = useApiData(getPatientEndpoint(), {
    entityName: "patients",
    dataKey: "patients",
  });

  // CRUD operations for appointments - only initialize if user exists
  const {
    create,
    update,
    deleteItem,
    loading: crudLoading,
    actionLoading,
    deleteLoading,
  } = useCrudOperations(
    "Appointment",
    shouldFetchData ? refetchAppointments : () => {}
  );

  // Search functionality - only works with actual data
  const {
    searchQuery,
    handleSearch,
    filteredData: searchedAppointments,
  } = useSearch(appointments, [
    "doctor.name",
    "patient.name",
    "doctor.specialization",
    "patient.email",
    "status",
    "appointment_time",
    "notes",
  ]);

  // Filter configuration based on user role
  const appointmentFilterConfig = useMemo(() => {
    const baseConfig = {
      status: {
        type: "select",
        label: "Status",
        options: [
          { value: "Scheduled", label: "Scheduled" },
          { value: "Completed", label: "Completed" },
          { value: "Cancelled", label: "Cancelled" },
          { value: "Pending", label: "Pending" },
          { value: "Rejected", label: "Rejected" },
        ],
      },
    };

    // If no user, return basic config
    if (!user) {
      return baseConfig;
    }

    // Doctor-specific filters
    if (user?.role === "doctor") {
      return {
        ...baseConfig,
        patient: {
          type: "select",
          label: "Patient",
          options: (patients || []).map((p) => ({
            value: p._id,
            label: p.name,
          })),
        },
      };
    }

    // Patient-specific filters
    if (user?.role === "patient") {
      return {
        ...baseConfig,
        doctor: {
          type: "select",
          label: "Doctor",
          options: (doctors || []).map((d) => ({
            value: d._id,
            label: d.name,
          })),
        },
      };
    }

    // Admin filters
    return {
      ...baseConfig,
      doctor: {
        type: "select",
        label: "Doctor",
        options: (doctors || []).map((d) => ({ value: d._id, label: d.name })),
      },
      patient: {
        type: "select",
        label: "Patient",
        options: (patients || []).map((p) => ({ value: p._id, label: p.name })),
      },
    };
  }, [user?.role, doctors, patients, user]);

  // Filter functionality
  const {
    filteredData: filteredAppointmentsData,
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
  } = useFilter(searchedAppointments, appointmentFilterConfig);

  // Sort functionality
  const { sortedData, sortField, sortOrder, handleSort } = useSort(
    filteredAppointmentsData,
    "appointment_time",
    "asc"
  );

  // Role-based appointment actions with authentication checks
  const createAppointment = async (appointmentData) => {
    if (!user) {
      throw new Error("Please log in to book appointments");
    }

    if (user?.role !== "patient") {
      throw new Error("Only patients can book appointments");
    }

    return await create(
      {
        doctor_id: appointmentData.doctor_id,
        patient_id: user._id,
        appointment_date: appointmentData.appointment_date,
        appointment_time: appointmentData.appointment_time,
        notes: appointmentData.notes || "",
      },
      "/appointment"
    );
  };

  // Update appointment with role-based logic
  const updateAppointment = async (appointmentId, updateData) => {
    if (!user) {
      throw new Error("Please log in to update appointments");
    }
    return await update(appointmentId, updateData, "/appointment");
  };

  // Delete appointment (admin and doctor only)
  const deleteAppointment = async (appointmentId) => {
    if (!user) {
      throw new Error("Please log in to delete appointments");
    }

    if (user?.role === "patient") {
      throw new Error("Patients cannot delete appointments");
    }
    return await deleteItem(appointmentId, "/appointment");
  };

  // Role-specific status updates
  const acceptAppointment = async (appointmentId) => {
    if (!user) {
      throw new Error("Please log in to manage appointments");
    }

    if (user?.role !== "doctor") {
      throw new Error("Only doctors can accept appointments");
    }
    return await updateAppointment(appointmentId, { status: "Scheduled" });
  };

  const rejectAppointment = async (appointmentId) => {
    if (!user) {
      throw new Error("Please log in to manage appointments");
    }

    if (user?.role !== "doctor") {
      throw new Error("Only doctors can reject appointments");
    }
    return await updateAppointment(appointmentId, { status: "Rejected" });
  };

  const completeAppointment = async (appointmentId) => {
    if (!user) {
      throw new Error("Please log in to manage appointments");
    }

    if (user?.role !== "doctor") {
      throw new Error("Only doctors can complete appointments");
    }
    return await updateAppointment(appointmentId, { status: "Completed" });
  };

  const cancelAppointment = async (appointmentId) => {
    if (!user) {
      throw new Error("Please log in to manage appointments");
    }

    if (user?.role !== "patient") {
      throw new Error("Only patients can cancel appointments");
    }
    return await updateAppointment(appointmentId, { status: "Cancelled" });
  };

  // Utility functions - safe to call even when no data
  const getAppointmentsByStatus = (status) => {
    return (appointments || []).filter((apt) => apt.status === status);
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split("T")[0];
    return (appointments || []).filter(
      (apt) =>
        apt.appointment_date === today &&
        ["Scheduled", "Pending"].includes(apt.status)
    );
  };

  const getPendingAppointments = () => {
    return getAppointmentsByStatus("Pending");
  };

  const getScheduledAppointments = () => {
    return getAppointmentsByStatus("Scheduled");
  };

  // Final data to display
  const displayAppointments = sortedData || [];

  const value = {
    // Data - provide empty arrays as fallbacks
    appointments: displayAppointments,
    rawAppointments: appointments || [],
    doctors: doctors || [],
    patients: patients || [],

    // Loading states
    loading: {
      appointments: appointmentsLoading,
      doctors: doctorsLoading,
      patients: patientsLoading,
      crud: crudLoading,
      action: actionLoading,
      delete: deleteLoading,
      authenticated: !!user, // Add authentication state
    },

    // Refetch functions - safe to call even when not authenticated
    refetch: {
      appointments: refetchAppointments,
      doctors: refetchDoctors,
      patients: refetchPatients,
    },

    // Search and filter
    search: {
      query: searchQuery,
      onSearch: handleSearch,
    },
    filter: {
      config: appointmentFilterConfig,
      filters,
      updateFilter,
      clearFilter,
      clearAllFilters,
      hasActiveFilters,
    },
    sort: {
      field: sortField,
      order: sortOrder,
      handleSort,
    },

    // CRUD operations
    createAppointment,
    updateAppointment,
    deleteAppointment,

    // Role-specific actions
    acceptAppointment,
    rejectAppointment,
    completeAppointment,
    cancelAppointment,

    // Utility functions
    getAppointmentsByStatus,
    getTodayAppointments,
    getPendingAppointments,
    getScheduledAppointments,

    // User info
    userRole: user?.role,
    isAuthenticated: !!user,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};
