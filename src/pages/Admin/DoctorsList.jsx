import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorsList = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold md-4">Doctors List</h1>
                <button onClick={() => navigate("/admin/doctors/create")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition">
                        Create Doctor Account
                </button>  
            </div>
            
        </div>
    );
};

export default DoctorsList;