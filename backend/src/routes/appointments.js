import express from "express";
import { bookAppointment } from "../controllers/appointmentController.js";
import validateRequest from "../middleware/validateRequest.js";
import validatePatientData from "../utils/validatePatientData.js";

const router = express.Router();

router.post("/", validateRequest(validatePatientData), bookAppointment);

export default router;
