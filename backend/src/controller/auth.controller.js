import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Doctor from "../models/doctor.model.js";

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
      const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

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

    const token = jwt.sign(
      {
        id: doctor._id,
        email: doctor.email,
        role: "doctor",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
