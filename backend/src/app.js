import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions.js";
import connectDB from "./config/database.js";
import { PORT } from "./config/constants.js";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

import doctorRoutes from "./routes/doctors.js";
import appointmentRoutes from "./routes/appointments.js";
import rateLimiter from "./middleware/rateLimiter.js";

app.use(rateLimiter);

app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(PORT, () => {
      console.log(`Server successfully listening at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
