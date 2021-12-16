import mongoose from 'mongoose';
import { tickerSchema } from './ticker.js';

const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

portfolioSchema.statics.initializePortfolio = async (userId) => {
    try{
        const portfolio = await Portfolio.create({user: userId})
        return portfolio
    }catch(err){
        return ApiError.internal("Something went Wrong... initializePortfolio")
    }
}

portfolioSchema.statics.findPortfolioById = async (userId) => {
    try{
        const portfolio = await Portfolio.findOne({ user: userId })
        return portfolio
    } catch(err){
        return ApiError.internal("Something went Wrong... findPortfolioById")
    }
}

const Portfolio = mongoose.model("Portfolio", portfolioSchema)
export default Portfolio