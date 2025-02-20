import express from 'express'
import { formData, allComplaints } from '../controllers/formDataControllers';

const router = express.Router();
router.post('/createFormData/', formData)
router.get('/allComplaints', allComplaints)

export default router;