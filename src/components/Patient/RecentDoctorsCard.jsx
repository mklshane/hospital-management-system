// components/Patient/RecentDoctorsCard.jsx
export default function RecentDoctorsCard({ doctors }) {
  return (
    <div className="bg-white dark:bg-[#242938] rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Recent Doctors
      </h3>
      <div className="space-y-3">
        {doctors.slice(0, 5).map((doc, i) => (
          <div key={i} className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full mr-3"></div>
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-gray-300">
                Dr. {doc.name}
              </p>
              {doc.specialization && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {doc.specialization}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
