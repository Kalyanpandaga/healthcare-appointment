import Doctor from "../models/Doctor.js";
import errorResponse from "../utils/errorResponse.js";

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    return errorResponse(res, 500, "SERVER_ERROR", err.message);
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor)
      return errorResponse(res, 404, "NOT_FOUND", "Doctor not found");
    res.json(doctor);
  } catch (err) {
    return errorResponse(res, 500, "SERVER_ERROR", err.message);
  }
};
