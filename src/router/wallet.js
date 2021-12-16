import express from 'express';
import { getUserWallet, loadBalance, unloadBalance } from '../controller/wallet.js';
import authenticate from '../middleware/auth.js';

const router = express.Router()

router.get('/wallet', authenticate, getUserWallet)
router.post('/load', authenticate, loadBalance)
router.post('/unload', authenticate, unloadBalance)

export default router;