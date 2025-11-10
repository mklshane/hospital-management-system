// src/pages/Doctor/DoctorProfile.jsx
import React, { useState, useEffect } from "react";
import { api } from "../../lib/axiosHeader"; // ← SAME AS DASHBOARD
import { useNavigate } from "react-router-dom";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const doctorId = user?._id;

  useEffect(() => {
    if (!doctorId) {
      navigate("/doctor/login");
      return;
    }

    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/doctor/${doctorId}`); // ← SAME AS DASHBOARD!
        const doc = res.data.doctor;

        setDoctor(doc);
        setFormData({
          name: doc.name || "",
          email: doc.email || "",
          age: doc.age || "",
          gender: doc.gender || "",
          contact: doc.contact || "",
          specialization: doc.specialization || "",
          schedule_time: Array.isArray(doc.schedule_time)
            ? doc.schedule_time
            : [],
        });
      } catch (err) {
        console.error("Failed to fetch doctor:", err);
        alert("Could not load profile");
        navigate("/doctor/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "schedule_time") {
      setFormData((prev) => ({
        ...prev,
        schedule_time: value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/doctor/${doctorId}`, formData); // ← SAME api!
      setDoctor(res.data.doctor);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (!doctor) return <div className="p-8 text-center text-red-600">Profile not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">My Doctor Profile</h1>

        {!editing ? (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            {/* Same display as before */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><strong>Name:</strong> {doctor.name}</div>
              <div><strong>Email:</strong> {doctor.email}</div>
              <div><strong>Contact:</strong> {doctor.contact || "—"}</div>
              <div><strong>Specialization:</strong> <span className="text-blue-700 font-medium">{doctor.specialization}</span></div>
              <div><strong>Age:</strong> {doctor.age || "—"}</div>
              <div><strong>Gender:</strong> {doctor.gender || "—"}</div>
            </div>
            <div>
              <strong>Schedule:</strong>
              <div className="mt-2 flex flex-wrap gap-2">
                {doctor.schedule_time?.length > 0 ? (
                  doctor.schedule_time.map((slot, i) => (
                    <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {slot}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No schedule set</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold">Edit Profile</h2>
            {/* Same form fields as before */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="border rounded px-3 py-2" />
              <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="border rounded px-3 py-2" />
              <input name="contact" value={formData.contact || ""} onChange={handleChange} placeholder="Contact" className="border rounded px-3 py-2" />
              <select name="specialization" value={formData.specialization} onChange={handleChange} required className="border rounded px-3 py-2">
                <option value="">Specialization</option>
                {["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Dermatology", "General Medicine", "Ophthalmology", "Psychiatry", "ENT", "Radiology"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input name="age" type="number" value={formData.age || ""} onChange={handleChange} placeholder="Age" className="border rounded px-3 py-2" />
              <select name="gender" value={formData.gender || ""} onChange={handleChange} className="border rounded px-3 py-2">
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Schedule (comma-separated)</label>
              <input
                name="schedule_time"
                value={formData.schedule_time.join(", ")}
                onChange={handleChange}
                placeholder="Mon 9-12, Thu 2-5"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg">
                Save
              </button>
              <button type="button" onClick={() => { setEditing(false); setFormData({ ...doctor, schedule_time: doctor.schedule_time || [] }); }} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;