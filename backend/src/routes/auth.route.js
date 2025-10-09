import express from "express";
import { adminLogin } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/admin/login", adminLogin);

export default router;