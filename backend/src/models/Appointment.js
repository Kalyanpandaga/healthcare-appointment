import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: [true, "Doctor ID is required"],
  },
  patientName: {
    type: String,
    required: [true, "Patient name is required"],
    trim: true,
    minlength: [2, "Patient name must be at least 2 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Invalid email address",
    },
  },
  phoneNo: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    validate: {
      validator: (value) => validator.isMobilePhone(value, "any"),
      message: "Invalid phone number",
    },
  },
  date: {
    type: Date,
    required: [true, "Appointment date is required"],
    validate: {
      validator: (value) => validator.isISO8601(value.toISOString()),
      message: "Invalid appointment date",
    },
  },
  time: {
    type: String,
    required: [true, "Appointment time is required"],
    validate: {
      validator: (value) =>
        validator.matches(value, /^([01]\d|2[0-3]):([0-5]\d)$/),
      message: "Invalid time format (HH:mm)",
    },
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
