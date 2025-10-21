import React from "react";
import { Bell, Calendar, User, ClipboardList, DollarSign, Activity } from "lucide-react";

const stats = [
  { title: "New Patient", value: "45", icon: <User className="text-blue-600" /> },
  { title: "Our Doctor", value: "23", icon: <ClipboardList className="text-blue-600" /> },
  { title: "Appointment", value: "14", icon: <Activity className="text-blue-600" /> },
  { title: "Income", value: "$5728", icon: <DollarSign className="text-blue-600" /> },
];

export default function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-1/3 p-2 border border-gray-300 rounded-lg"
          />
          <Bell className="text-gray-600 cursor-pointer" size={22} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 shadow rounded-xl flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Patient Status Chart Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-2">Patient Status</h3>
          <div className="h-48 flex items-center justify-center text-gray-400">
            [Chart Placeholder]
          </div>
        </div>

        {/* Bottom Section: Appointment Requests + Recent Patients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointment Requests */}
          <div className="bg-white p-5 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Appointment Requests</h3>
              <button className="text-blue-600 text-sm font-semibold">See All</button>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="p-2">Name</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Daniel Smith</td>
                  <td className="p-2">04/18/2025</td>
                  <td className="p-2">10:30 AM</td>
                  <td className="p-2 text-green-600 font-semibold">Accepted</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Albert Diaz</td>
                  <td className="p-2">05/10/2025</td>
                  <td className="p-2">9:00 AM</td>
                  <td className="p-2 text-yellow-600 font-semibold">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Recent Patients */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Patients</h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="p-2">Name</th>
                  <th className="p-2">Gender</th>
                  <th className="p-2">Disease</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Glenn Stanley</td>
                  <td className="p-2">Male</td>
                  <td className="p-2">Cancer</td>
                  <td className="p-2 text-blue-600 font-semibold">Outpatient</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Evelyn Thomas</td>
                  <td className="p-2">Female</td>
                  <td className="p-2">Asthma</td>
                  <td className="p-2 text-blue-600 font-semibold">Inpatient</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Notification Panel */}
      <aside className="w-72 bg-white shadow-inner p-4 border-l">
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <ul className="space-y-3 text-sm">
          <li>Dr. Santos updated her schedule.</li>
          <li>New patient registered: Juan Cruz.</li>
          <li>New patient registered: Maria Dela Cruz.</li>
        </ul>
      </aside>
    </div>
  );
}
