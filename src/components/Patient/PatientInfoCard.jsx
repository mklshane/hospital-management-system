// components/Patient/PatientInfoCard.jsx
import { User } from "lucide-react";

export default function PatientInfoCard({ user }) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white">
      <div className="flex items-start mb-6">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{user?.name || "Patient"}</h2>
          <p className="text-blue-100">Patient</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        {user?.age && (
          <div>
            <p className="text-blue-100 mb-1">Age</p>
            <p className="text-xl font-semibold">{user.age}</p>
          </div>
        )}
        {user?.gender && (
          <div>
            <p className="text-blue-100 mb-1">Sex</p>
            <p className="text-xl font-semibold">{user.gender}</p>
          </div>
        )}
        {user?.contact && (
          <div>
            <p className="text-blue-100 mb-1">Contact</p>
            <p className="text-xl font-semibold">{user.contact}</p>
          </div>
        )}
      </div>
    </div>
  );
}
