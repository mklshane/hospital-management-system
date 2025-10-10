import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

dotenv.config();

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required." });
    }

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      generateTokenAndSetCookie({ role: "admin", email }, res);
      return res.status(200).json({ message: "Successfully logged in." });
    }

    return res.status(401).json({
      message: "Invalid admin credentials",
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const doctorRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      contact,
      specialization,
      schedule_time,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const doctorAlreadyExists = await Doctor.findOne({ email });

    if (doctorAlreadyExists) {
      return res.status(400).json({ message: "Doctor already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      contact,
      specialization,
      schedule_time,
    });

    await newDoctor.save();

    res.status(201).json({ message: "Doctor registered successfully." });
  } catch (error) {
    console.error("Doctor registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(
      { id: doctor._id, email: doctor.email, role: "doctor" },
      res
    );

    const { password: _, ...doctorData } = doctor._doc;

    res.status(200).json({
      message: "Doctor logged in successfully",
      doctor: doctorData,
    });
  } catch (error) {
    console.error("Doctor login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const patientRegister = async (req, res) => {
  try {
    const { name, email, password, age, gender, contact, address } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const userAlreadyExists = await Patient.findOne({ email });

    if (userAlreadyExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Patient({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      contact,
      address,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("User registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const patientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await Patient.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(
      { id: user._id, email: user.email, role: "patient" },
      res
    );

    const { password: _, ...patientData } = user._doc;

    res.status(200).json({
      message: "User logged in successfully",
      user: patientData,
    });
  } catch (error) {
    console.error("Patient login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // set to true in production
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
