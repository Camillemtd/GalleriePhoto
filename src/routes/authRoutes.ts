import express from 'express';
import { loginUser } from '../controllers/user';
import { loginLimiter } from '../middleware/rateLimitConfig'
const router = express.Router();

router.post('/login', loginLimiter, loginUser);

export default router;