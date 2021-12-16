import express from 'express';
import './database/mongoose.js';
import apiErrorHandler from './error/apierrorHandler.js';
import sessions from './middleware/sessions.js';
import userRouter from './router/user.js';
import walletRouter from './router/wallet.js';
import portfolioRouter from './router/portfolio.js';
import watchlistRouter from './router/watchlist.js';

const app = express();

// Middleware to Handle JSON Parsing
app.use(express.json())

// Middleware to Initialize and Handle Sessions
app.use(sessions);

// Server Endpoint Routes
app.use(userRouter)
app.use(walletRouter)
app.use(portfolioRouter)
app.use(watchlistRouter)

// Error Handling
app.use(apiErrorHandler)

export default app;