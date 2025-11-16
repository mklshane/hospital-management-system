import ThemeToggle from "@/components/ThemeToggle";
import { Clock, AlertCircle, CheckCircle2, Users } from "lucide-react";


const DashboardStats = ({
  stats,
  doctorInfo,
  loading,
}) => {
  const statItems = [
    {
      label: "Today's Appointments",
      value: stats?.today ?? 0,
      icon: <Clock className="w-5 h-5 text-white" />,
    },
    {
      label: "Pending Approvals",
      value: stats?.pending ?? 0,
      icon: <AlertCircle className="w-5 h-5 text-white" />,
    },
    {
      label: "Completed Appointments",
      value: stats?.completed ?? 0,
      icon: <CheckCircle2 className="w-5 h-5 text-white" />,
    },
    {
      label: "Assigned Patients",
      value: stats?.patients ?? 0,
      icon: <Users className="w-5 h-5 text-white" />,
    },
  ];

  return (
    <div className="col-span-9 row-span-1 bg-gradient-to-r from-blue-500 to-blue-600 shadow-md rounded-xl p-4 text-white flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          {loading ? (
            <>
              <div className="h-7 w-48 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-white/15 rounded animate-pulse"></div>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold font-montserrat">
                Dr. {doctorInfo?.name ?? "Dr. Unknown"}
              </h1>
              <p className="text-blue-200 font-figtree text-sm">
                {doctorInfo?.specialization ?? "—"}
              </p>
            </>
          )}
        </div>
        <ThemeToggle />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 flex-1 min-h-0">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col justify-center border border-white/20 shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="h-3 w-24 bg-white/20 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-16 bg-white/20 rounded animate-pulse"></div>
              </div>
            ))
          : statItems.map((stat, i) => (
              <div
                key={i}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex flex-col justify-center border border-white/20 shadow transition-all hover:bg-white/15 hover:border-white/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-blue-100 font-figtree leading-none">
                      {stat.label}
                    </p>
                    <p className="text-2xl text-white font-bold font-montserrat leading-none mt-1">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default DashboardStats;
