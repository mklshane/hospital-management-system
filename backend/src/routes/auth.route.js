import express from "express";
import { adminLogin, doctorLogin, doctorRegister, logout, patientLogin, patientRegister } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/doctor/register", doctorRegister);
router.post("/doctor/login", doctorLogin);
router.post("/patient/register", patientRegister);
router.post("/patient/login", patientLogin);
router.post("/logout", logout)


export default router;