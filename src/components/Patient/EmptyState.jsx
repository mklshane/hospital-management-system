import React from 'react'
import { Plus, Calendar, Stethoscope } from "lucide-react";

const EmptyState = () => {
   return (
     <div className="flex flex-col items-center justify-center px-4 text-center">
       {/* Animated Illustration */}
       <div className="relative mb-8">
         <div className="w-32 h-32 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-4 mx-auto">
           <div className="relative">
             <Calendar className="w-12 h-12 text-blue-500 dark:text-blue-400" />
             <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
               <span className="text-white text-xs font-bold">0</span>
             </div>
           </div>
         </div>

         {/* Floating elements */}
         <div className="absolute top-4 -left-4 w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
           <Stethoscope className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
         </div>
         <div className="absolute bottom-4 -right-4 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
           <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
         </div>
       </div>

       {/* Text Content */}
       <div className="max-w-md mx-auto">
         <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
           No Appointments Yet
         </h3>
         <p className="text-gray-500 dark:text-gray-400 mb-2">
           You haven't scheduled any appointments yet. Book your first
           appointment to get started with managing your healthcare.
         </p>
         <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
           All your upcoming and past appointments will appear here for easy
           access.
         </p>
       </div>
     </div>
   );
}

export default EmptyState