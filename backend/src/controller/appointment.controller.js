import Appointment from "../models/appointment.model.js"
import Doctor from "../models/doctor.model.js"
import Patient from "../models/patient.model.js"

export const createAppointment = async (req,res) => {
    try {
      const {
        doctor_id,
        patient_id,
        appointment_date,
        appointment_time,
        notes,
      } = req.body;

      if (!doctor_id || !patient_id || !appointment_date || !appointment_time) {
        return res.status(400).json({
          message: "Incomplete data",
        });
      }

      const doctor = await Doctor.findById(id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      const patient = await Patient.findById(patient_id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

       const existingAppointment = await Appointment.findOne({
         doctor: doctor_id,
         appointment_date,
         appointment_time,
       });

       if (existingAppointment) {
         return res.status(400).json({
           message:
             "This doctor already has an appointment at the selected date and time.",
         });
       }

      const newAppointment = new Appointment({
        doctor: doctor_id,
        patient: patient_id,
        appointment_date,
        appointment_time,
        notes: notes || "",
      });

      await newAppointment.save();

      return res
        .status(201)
        .json({ message: "Appointment created successfully", newAppointment });
    } catch (error) {
      console.error("Create appointment error:", error);
      return res.status(500).json({ message: "Server error" });
    }
}

export const getAppointment = async (req, res) => {
  try {
    const userRole = req.user?.role; 
    const userId = req.user?.id; 

    if (!userRole || !userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let appointments;

    // admin: can view all appointments
    if (userRole === "admin") {
      appointments = await Appointment.find()
        .populate("doctor", "name email specialization")
        .populate("patient", "name email contact");
    }

    // doctor: can view only their assigned appointments
    else if (userRole === "doctor") {
      appointments = await Appointment.find({ doctor: userId })
        .populate("doctor", "name email specialization")
        .populate("patient", "name email contact");
    }

    // patient: can view only their own appointments
    else if (userRole === "patient") {
      appointments = await Appointment.find({ patient: userId })
        .populate("doctor", "name email specialization")
        .populate("patient", "name email contact");
    }

    else {
      return res.status(403).json({ message: "Invalid role" });
    }

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Get appointment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role;
    const userId = req.user?.id;
    const { status, appointment_date, appointment_time } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (userRole === "patient") {
      if (appointment.patient.toString() !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (status === "Cancelled") {
        appointment.status = "Cancelled";
      } else if (appointment_date || appointment_time) {
        appointment.appointment_date =
          appointment_date || appointment.appointment_date;
        appointment.appointment_time =
          appointment_time || appointment.appointment_time;
        appointment.status = "Pending"; // reset to pending after rescheduling
      } else {
        return res.status(400).json({ message: "Invalid update request" });
      }
    }

    if (userRole === "doctor") {
      if (appointment.doctor.toString() !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (status === "Accepted") {
        appointment.status = "Scheduled";
      } else if (status === "Rejected") {
        appointment.status = "Rejected";
      } else if (status === "Completed") {
        appointment.status = "Completed";
      } else {
        return res.status(400).json({
          message:
            "Doctors can only update status to Accepted(Scheduled), Rejected, or Completed",
        });
      }
    }

    await appointment.save();

    return res.status(200).json({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Update appointment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.remove();

    return res
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Delete appointment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};