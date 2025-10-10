import express from "express"
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import { deleteDoctorAcc, fetchAllDoctors, fetchDoctorById, updateDoctorData } from "../controller/doctor.controller.js";


const router = express.Router();

router.get("/",  verifyToken, authorizeRoles("admin", "patient"), fetchAllDoctors);    // get all doctors
router.get("/:id", verifyToken, authorizeRoles("admin", "doctor", "patient"), fetchDoctorById); // get specific doctor using id
router.put("/:id", verifyToken, authorizeRoles("admin", "doctor"), updateDoctorData); // update doctor profile
router.delete("/:id", verifyToken, authorizeRoles("admin", "doctor"), deleteDoctorAcc); // delete doctor account 

export default router;