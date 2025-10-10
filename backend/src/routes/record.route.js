import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import { addRecord, getRecords } from "../controller/record.controller.js";

const router = express.Router();

router.post("/:appointmentId", verifyToken, authorizeRoles("doctor"), addRecord);

// Get medical records of a patient
// Doctor: only for their assigned patients
// Patient: only their own records
router.get("/:patientId", verifyToken, authorizeRoles("patient", "doctor", "admin"), getRecords);

export default router;
