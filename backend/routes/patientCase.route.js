
import express from 'express';
import { createPatientCase, getPatientCases, getPatientCaseById } from '../controllers/patientCase.controller.js'; 

const router = express.Router();

router.post('/', createPatientCase);
router.get('/', getPatientCases); 

router.get('/:id', getPatientCaseById);


export default router;
