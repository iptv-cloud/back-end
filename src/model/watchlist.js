import mongoose from 'mongoose';
import { tickerSchema } from './ticker.js';

const watchlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
})

watchlistSchema.statics.initializeWatchlist = async (userId) => {
    try{
        const watchlist = await Watchlist.create({user: userId})

        return watchlist
    }catch(err){
        return ApiError.internal("Something went Wrong... initializeWatchlist")
    }
}

watchlistSchema.statics.findWatchlistById = async (userId) => {
    try{
        const watchlist = await Watchlist.findOne({ user: userId })
        
        return watchlist
    } catch(err){
        return ApiError.internal("Something went Wrong... findWatchlistById")
    }
}

const Watchlist = mongoose.model("Watchlist", watchlistSchema)
export default Watchlist