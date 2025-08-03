import mongoose from "mongoose";
import validator from "validator";
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Doctor name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
  },
  specialization: {
    type: String,
    required: [true, "Specialization is required"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Profile image URL is required"],
    validate: {
      validator: validator.isURL,
      message: "Invalid image URL",
    },
  },
  available: {
    type: Boolean,
    default: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  experience: {
    type: Number,
    required: [true, "Experience (years) is required"],
    min: [0, "Experience cannot be negative"],
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  location: {
    type: String,
    trim: true,
    required: [true, "Location is required"],
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
