import express from 'express';
import { getWatchlist, addToWatchlist, removeFromWatchlist,  updateWatchlistPrices } from '../controller/watchlist.js';
import authenticate from '../middleware/auth.js';

const router = express.Router()

router.get('/watchlist', authenticate, getWatchlist)
router.post('/addwatchlist', authenticate, addToWatchlist)
router.post('/removewatchlist', authenticate, removeFromWatchlist)
router.post('/watchlistupdate', authenticate, updateWatchlistPrices)

export default router;