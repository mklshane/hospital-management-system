import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact_number: {
    type: String,
    required: false, 
    trim: true,
  },
  age: {
    type: Number,
    required: false,
  },
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
