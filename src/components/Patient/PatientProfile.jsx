import { User, Mail, Phone, MapPin } from "lucide-react";

export default function PatientProfile({ user }) {
  return (
    <div className="lg:col-span-3">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg h-full min-h-[500px] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name || "Patient"}</h2>
              <p className="text-sm opacity-90">Patient</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            {user?.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 opacity-80" />
                <span className="font-medium">{user.email}</span>
              </div>
            )}
            {user?.contact && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 opacity-80" />
                <span className="font-medium">{user.contact}</span>
              </div>
            )}
            {user?.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 opacity-80" />
                <span className="font-medium">{user.address}</span>
              </div>
            )}
            {(user?.age || user?.gender) && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {user?.age && (
                  <div>
                    <p className="opacity-80">Age</p>
                    <p className="font-semibold">{user.age}</p>
                  </div>
                )}
                {user?.gender && (
                  <div>
                    <p className="opacity-80">Gender</p>
                    <p className="font-semibold">{user.gender}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/20">
          <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
