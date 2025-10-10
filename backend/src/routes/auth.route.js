import express from "express";
import { adminLogin, doctorLogin, doctorRegister } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/doctor/register", doctorRegister);
router.post("/doctor/login", doctorLogin)

export default router;