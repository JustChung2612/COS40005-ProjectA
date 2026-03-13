import express from "express";
import { parseAiPatientCasePrompt } from "../controllers/OpenAi.controller.js";

const router = express.Router();

router.post("/filter-patient-cases", parseAiPatientCasePrompt);

export default router;