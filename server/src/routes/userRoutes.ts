import express from 'express';
import { getUsers, updateUserProfile } from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/profile').put(protect, updateUserProfile);

export default router;
