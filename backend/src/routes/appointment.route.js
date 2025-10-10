import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import { createAppointment, deleteAppointment, getAppointment, updateAppointment } from "../controller/appointment.controller.js";

const router = express.Router();

// Patient creates an appointment
router.post("/", verifyToken, authorizeRoles("patient"), createAppointment);

// Get appointments
// - Patient: only their own
// - Doctor: appointments assigned to them
// - Admin: all appointments
router.get("/", verifyToken, authorizeRoles("admin", "patient", "doctor"), getAppointment);


// Update appointment
// Patient: Cancel, Reschedule
// Doctor: Accept, Reject, Complete
router.put("/:id", verifyToken, authorizeRoles("doctor", "patient"), updateAppointment);

router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteAppointment)

export default router;
