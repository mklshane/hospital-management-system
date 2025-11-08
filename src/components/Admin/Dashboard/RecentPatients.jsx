import React from "react";
import { useNavigate } from "react-router-dom";

const RecentPatients = ({ patients, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 rounded-xl shadow border bg-card flex flex-col min-h-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Recent Patients</h2>
        <button
          onClick={() => navigate("/admin/patients")}
          className="text-blue-600 text-sm font-semibold hover:underline"
        >
          See All
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        ) : patients.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No recent patients
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[250px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="p-2">Name</th>
                  <th className="p-2">Contact</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="p-2 font-medium">{p.name}</td>
                    <td className="p-2 text-muted-foreground">
                      {p.contact || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPatients;
