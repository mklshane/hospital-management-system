import express from "express"
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import { deletePatientAcc, fetchAllPatients, fetchPatientById, updatePatientData } from "../controller/patient.controller.js";

const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin"), fetchAllPatients);                    // get all patients
router.get("/:id", verifyToken, authorizeRoles("admin", "patient"), fetchPatientById);      // get specific patient based on ID
router.put("/:id", verifyToken, authorizeRoles("admin", "patient"), updatePatientData);     // update patient profile
router.delete("/:id", verifyToken, authorizeRoles("admin", "patient"), deletePatientAcc);   // delete patient account

export default router;
