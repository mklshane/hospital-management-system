import React, { useState, useEffect } from "react";
import { api } from "../../lib/axiosHeader";
import { useNavigate } from "react-router-dom";
import { Edit3, Save, X, Calendar, Mail, Phone, User, Stethoscope } from "lucide-react";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

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
        const res = await api.get(`/doctor/${doctorId}`);
        const doc = res.data.doctor;
        setDoctor(doc);
        setFormData({
          name: doc.name || "",
          email: doc.email || "",
          age: doc.age || "",
          gender: doc.gender || "",
          contact: doc.contact || "",
          specialization: doc.specialization || "",
          schedule_time: Array.isArray(doc.schedule_time) ? doc.schedule_time : [],
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
        schedule_time: value.split(",").map((s) => s.trim()).filter(Boolean),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/doctor/${doctorId}`, formData);
      setDoctor(res.data.doctor);
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen grid grid-cols-12 gap-3 p-4 bg-ui-background">
        <div className="col-span-12 bg-ui-card rounded-xl p-6 animate-pulse">
          <div className="h-8 w-64 bg-ui-border rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-ui-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="h-screen grid place-items-center bg-ui-background">
        <p className="text-red-600 font-medium">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen grid grid-cols-12 gap-3 pb-8 bg-ui-background overflow-hidden">
      <div className="col-span-12 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-montserrat">My Profile</h1>
            <p className="text-sm text-muted-foreground font-figtree">Manage your professional information</p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue hover:bg-blue-700 text-white rounded-lg text-sm font-figtree transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Main Card - Takes remaining height */}
        <div className="flex-1 bg-ui-card rounded-xl border border-ui-border overflow-hidden flex flex-col min-h-0">
          {!editing ? (
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: User, label: "Full Name", value: doctor.name },
                  { icon: Mail, label: "Email", value: doctor.email },
                  { icon: Phone, label: "Contact", value: doctor.contact || "—" },
                  { icon: Stethoscope, label: "Specialization", value: doctor.specialization, highlight: true },
                  { icon: User, label: "Age", value: doctor.age || "—" },
                  { icon: User, label: "Gender", value: doctor.gender || "—" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-ui-muted rounded-lg">
                    <item.icon className="w-5 h-5 text-blue" />
                    <div>
                      <p className="text-xs text-muted-foreground font-figtree">{item.label}</p>
                      <p className={`font-medium ${item.highlight ? "text-blue-600" : "text-foreground"}`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Schedule */}
              <div className="border-t border-ui-border pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue" />
                  <h3 className="text-lg font-semibold font-montserrat">Weekly Schedule</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {doctor.schedule_time?.length > 0 ? (
                    doctor.schedule_time.map((slot, i) => (
                      <span
                        key={i}
                        className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-figtree border border-green-200"
                      >
                        {slot}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm font-figtree">No schedule set</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              <h2 className="text-xl font-semibold font-montserrat border-b border-ui-border pb-4">
                Edit Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground font-figtree mb-2">Full Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 bg-ui-muted border border-ui-border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground font-figtree mb-2">Email</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 bg-ui-muted border border-ui-border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground font-figtree mb-2">Contact Number</label>
                  <input name="contact" value={formData.contact || ""} onChange={handleChange} className="w-full px-3 py-2 bg-ui-muted border border-ui-border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground font-figtree mb-2">Specialization</label>
                  <select name="specialization" value={formData.specialization} onChange={handleChange} required className="w-full px-3 py-2 bg-ui-muted border border-ui-border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue">
                    <option value="">Select Specialization</option>
                    {["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Dermatology", "General Medicine", "Ophthalmology", "Psychiatry", "ENT", "Radiology"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground font-figtree mb-2">Age</label>
                  <input name="age" type="number" value={formData.age || ""} onChange={handleChange} className="w-full px-3 py-2 bg-ui-muted border border-ui-border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground font-figtree mb-2">Gender</label>
                  <select name="gender" value={formData.gender || ""} onChange={handleChange} className="w-full px-3 py-2 bg-ui-muted border border-ui-border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue">
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground font-figtree mb-2">
                  Weekly Schedule (comma-separated)
                </label>
                <input
                  name="schedule_time"
                  value={formData.schedule_time.join(", ")}
                  onChange={handleChange}
                  placeholder="Mon 9:00-12:00, Tue 14:00-17:00"
                  className="w-full px-3 py-2 bg-ui-muted border border-ui-border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue"
                />
                <p className="text-xs text-muted-foreground mt-1">e.g., Mon 9-12, Thu 2-5</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-ui-border">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-figtree transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({ ...doctor, schedule_time: doctor.schedule_time || [] });
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-ui-muted hover:bg-ui-border text-foreground rounded-lg text-sm font-figtree transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;