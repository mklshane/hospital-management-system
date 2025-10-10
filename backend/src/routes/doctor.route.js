import express from "express"
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import { fetchAllDoctors, fetchDoctorById } from "../controller/doctor.controller.js";


const router = express.Router();

router.get("/",  verifyToken, authorizeRoles("admin", "patient"), fetchAllDoctors);    // get all doctors
router.get("/:id", verifyToken, authorizeRoles("admin", "doctor", "patient"), fetchDoctorById); // get specific doctor using id
// router.put("/:id"); // update doctor profile
// router.delete("/:id"); // delete 

export default router;