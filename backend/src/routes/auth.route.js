import express from "express";
import { adminLogin, doctorLogin, doctorRegister, logout, patientLogin, patientRegister } from "../controller/auth.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

const router = express.Router();

router.post("/admin/login", adminLogin);            // admin login
router.post("/doctor/register", verifyToken, authorizeRoles("admin"), doctorRegister);    // doctor account creation (by admin) 
router.post("/doctor/login", doctorLogin);          // doctor login
router.post("/patient/register", patientRegister);  // patient account creation
router.post("/patient/login", patientLogin);        // patient login
router.post("/logout", logout);                     // user logout


export default router;