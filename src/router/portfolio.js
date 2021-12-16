import express from 'express';
import { buyAStock, getPortfolio, sellAStock } from '../controller/portfolio.js';
import authenticate from '../middleware/auth.js';

const router = express.Router()

router.get('/portfolio', authenticate, getPortfolio)
router.post('/buy', authenticate, buyAStock)
router.post('/sell', authenticate, sellAStock)

export default router;