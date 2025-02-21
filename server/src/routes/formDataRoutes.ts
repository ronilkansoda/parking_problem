import express from 'express'
import { formData, allComplaints, warningBot, suspensionBot } from '../controllers/formDataControllers';

const router = express.Router();
router.post('/createFormData/', formData)
router.get('/allComplaints', allComplaints)
router.post('/warningBot', warningBot)
router.post('/suspensionBot', suspensionBot)

export default router;