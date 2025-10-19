import express from "express";
import cors from 'cors'
import { connectDB } from './lib/db.js';

const app = express();
const PORT = 5000;


app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
    connectDB();
})