
import express from 'express';
import { createPatientCase, getPatientCases } from '../controllers/patientCase.controller.js'; 

const router = express.Router();

router.post('/', createPatientCase);
router.get('/', getPatientCases); 

export default router;
