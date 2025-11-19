import { User, Mail, Phone, MapPin } from "lucide-react";
export default function PatientProfile({ user }) {
  return (
    <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg h-full flex flex-col">

      {/* Avatar + name */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{user?.name || "Patient"}</h2>
          <p className="text-xs opacity-90">Patient Account</p>
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-3 text-sm flex-1">
        {user?.email && (
          <div className="flex items-center gap-3">
            <Mail className="w-3.5 h-3.5 opacity-80" />
            <span className="truncate">{user.email}</span>
          </div>
        )}
        {user?.contact && (
          <div className="flex items-center gap-3">
            <Phone className="w-3.5 h-3.5 opacity-80" />
            <span>{user.contact}</span>
          </div>
        )}
        {user?.address && (
          <div className="flex items-center gap-3">
            <MapPin className="w-3.5 h-3.5 opacity-80" />
            <span className="truncate">{user.address}</span>
          </div>
        )}
        {(user?.age || user?.gender) && (
          <div className="flex justify-center gap-24 mt-5">
            {user?.age && (
              <div>
                <p className="opacity-80 text-xs">Age</p>
                <p className="font-semibold text-sm">{user.age}</p>
              </div>
            )}
            {user?.gender && (
              <div>
                <p className="opacity-80 text-xs">Gender</p>
                <p className="font-semibold text-sm">{user.gender}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
