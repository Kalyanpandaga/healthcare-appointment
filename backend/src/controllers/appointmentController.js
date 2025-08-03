import Appointment from "../models/Appointment.js";
import errorResponse from "../utils/errorResponse.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientName, email, phoneNo, date, time } = req.body;

    const appointment = await Appointment.create({
      doctorId,
      patientName,
      email,
      phoneNo,
      date: new Date(date),
      time,
    });
    res.status(201).json(appointment);
  } catch (err) {
    return errorResponse(res, 500, "SERVER_ERROR", err.message);
  }
};

export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctorId }).sort({
      date: 1,
      time: 1,
    });
    res.json(appointments);
  } catch (err) {
    return errorResponse(res, 500, "SERVER_ERROR", err.message);
  }
};
