import express from "express";
import cors from 'cors';
import 'dotenv/config';
import cookieParser from "cookie-parser";
import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.route.js';
import patientCaseRoutes from './routes/patientCase.route.js';

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",  // ✅ must match your frontend URL exactly
    credentials: true,                // ✅ allow cookies / session sharing
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/patient-cases", patientCaseRoutes);

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
    connectDB();
})