import express from 'express';
import { userRegister, userLogin, userLogout } from '../controller/user.js';
import authenticate from '../middleware/auth.js';

const router = express.Router()

router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/logout', authenticate, userLogout)

export default router;