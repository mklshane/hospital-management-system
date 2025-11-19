import { Plus } from "lucide-react";

export default function NewAppointmentButton({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-600 transition cursor-pointer"
    >
      <Plus className="w-8 h-8 mb-2" />
      <p className="text-sm font-medium">New Appointment</p>
    </div>
  );
}
