import { FileText, Download } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function MedicalRecordsCard() {
  return (
    <div className="bg-white dark:bg-[#242938] rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Medical Records
        </h3>
        <ThemeToggle />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-blue-50 dark:bg-[#323948] rounded-lg"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-[#3d4a5c] rounded-lg flex items-center justify-center mr-3">
                <FileText
                  size={20}
                  className="text-blue-500 dark:text-blue-400"
                />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">
                  Blood Test Results
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  July 18, 2025
                </p>
              </div>
            </div>
            <button className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
              <Download size={16} className="text-white" />
            </button>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition">
        View All Records
      </button>
    </div>
  );
}
