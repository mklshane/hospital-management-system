import express from "express"
import Doctor from "../models/doctor.model.js"

export const fetchAllDoctors = async (req, res) => {
  try {
    
    const doctors = await Doctor.find().select("-password");

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    res.status(200).json({
      message: "Doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const fetchDoctorById = async (req,res) => {
    try {
        const { id } = req.params;

        const doctor = await Doctor.findById(id).select("-password");

        if(!doctor){
            return res.status(404).json({message: "Doctor not found"});
        }

        res.status(200).json({
            message: "Doctor fetched successfully",
            doctor,
        });

    } catch (error) {
        console.error("Fetch doctor by ID error:", error);
        res.status(500).json({message: "Server error"})
    }
}