import express from "express";
import { parseAiPatientCasePrompt, aiGradeEssay } from "../controllers/OpenAi.controller.js";

const router = express.Router();

router.post("/filter-patient-cases", parseAiPatientCasePrompt);
router.post("/grade-essay", aiGradeEssay);

export default router;