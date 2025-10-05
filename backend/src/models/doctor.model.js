import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
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
    specialization: {
      type: String,
      required: true,
    },
    schedule_time: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true } 
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
