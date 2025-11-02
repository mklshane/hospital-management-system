import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";
import PatientCard from "../../components/PatientCard";
import { api } from "../../lib/axiosHeader";

const DoctorPatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/patient");
      const fetchedPatients = res.data.patients;

      // Optional: enrich with mock appointment/records if not in DB
      const enriched = fetchedPatients.map(p => ({
        ...p,
        lastVisit: p.lastVisit || "No record",
        upcomingAppointment: p.upcomingAppointment || null,
        condition: p.condition || null,
      }));

      setPatients(enriched);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      setError(err.message || "Failed to load patients");
      if (err.status === 401 || err.status === 403) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch single patient details
  const fetchPatientDetails = async (id) => {
    try {
      const res = await api.get(`/patient/${id}`);
      setSelectedPatient(res.data.patient);
    } catch (err) {
      console.error("Failed to fetch patient:", err);
      setError("Could not load patient details");
    }
  };

  // Load patients on mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle patient click
  const handlePatientClick = (patient) => {
    setSelectedPatient(null); // reset
    fetchPatientDetails(patient._id);
  };

  return (
    <div className="min-h-screen flex flex-col pb-10">
      <div className="flex-1 grid grid-cols-12 overflow-y-auto gap-5">
        {/* LEFT SECTION - PATIENTS LIST */}
        <div className="scrollbar col-span-9 bg-ui-card rounded-2xl p-6 flex flex-col overflow-y-auto max-h-[95vh] relative">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold font-montserrat text-foreground">
              My Patients
            </h1>
            <ThemeToggle />
          </div>

          {loading ? (
            <div className="col-span-3 text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Loading patients...</p>
            </div>
          ) : error ? (
            <div className="col-span-3 text-center py-10">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchPatients}
                className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          ) : patients.length === 0 ? (
            <p className="col-span-3 text-center text-muted-foreground py-10">
              No patients found.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {patients.map((patient) => (
                <PatientCard
                  key={patient._id}
                  patient={patient}
                  isSelected={selectedPatient?._id === patient._id}
                  onClick={() => handlePatientClick(patient)}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SECTION - PATIENT DETAILS */}
        <div className="col-span-3 bg-ui-card rounded-2xl p-8 flex flex-col overflow-y-auto max-h-[95vh] sticky top-0">
          <h2 className="text-xl font-bold font-montserrat text-foreground mb-6">
            Patient Details
          </h2>

          {selectedPatient ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedPatient.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedPatient.age || "?"} years • {selectedPatient.gender || "N/A"}
                </p>
                {selectedPatient.email && (
                  <p className="text-xs text-muted-foreground mt-1">{selectedPatient.email}</p>
                )}
              </div>

              {/* Appointments */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Appointments</h4>
                <div className="space-y-2 text-sm">
                  {selectedPatient.upcomingAppointment ? (
                    <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg">
                      Upcoming: {selectedPatient.upcomingAppointment}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No upcoming appointments</p>
                  )}
                  <p className="text-muted-foreground">
                    Last Visit: {selectedPatient.lastVisit || "N/A"}
                  </p>
                </div>
              </div>

              {/* Medical Summary */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Medical Summary</h4>
                {selectedPatient.condition ? (
                  <span className="inline-block bg-warning/10 text-warning px-3 py-1 rounded-full text-sm">
                    {selectedPatient.condition}
                  </span>
                ) : (
                  <p className="text-muted-foreground text-sm">No active conditions</p>
                )}
              </div>

              {/* Contact */}
              {selectedPatient.contact && (
                <div>
                  <h4 className="font-medium text-foreground mb-1">Contact</h4>
                  <p className="text-sm text-muted-foreground">{selectedPatient.contact}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6">
                <button className="flex-1 bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition">
                  View Full Record
                </button>
                <button className="flex-1 border border-primary text-primary py-2 rounded-lg font-medium hover:bg-primary/5 transition">
                  Schedule
                </button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Select a patient to view details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatientsList;