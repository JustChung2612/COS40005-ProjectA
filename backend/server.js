import express from "express";
import cors from 'cors';
import 'dotenv/config';
import cookieParser from "cookie-parser";
import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.route.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
    connectDB();
})