import express from 'express';
import { enrollCourse, getUserEnrollments } from '../controllers/enrollController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:courseId', protect, enrollCourse);
router.get('/my-enrollments', protect, getUserEnrollments);

export default router;
