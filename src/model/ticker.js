import mongoose from 'mongoose';
import ApiError from '../error/ApiError.js';
import Wallet from './wallet.js';

export const tickerSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    change: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    market: {
        type: String,
        required: true,
        trim: true
    },
    shares: {Number},
    purchasePrice: {Number},
    bookValue: {Number},
    marketValue: {Number},
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Portfolio"
    },
    watchlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Watchlist"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

tickerSchema.statics.updateSharePrice = async (stock) => {
    try{
        await Ticker.updateOne({ ticker: stock.ticker }, { price: stock.price, change: stock.change })

        return
    }catch(err){
        return ApiError.internal("Something went Wrong... updateSharePrice")
    }
}

tickerSchema.statics.getWatchlist = async (watchlistId) => {
    try{
        
        const watchlist = await Ticker.find({ watchlist: watchlistId })
    
        return watchlist

    }catch(err){
        return ApiError.internal("Something went Wrong... addToWatchlist")
    }
}

tickerSchema.statics.addToWatchlist = async (userId, watchlist, stock) => {
    
    try{
        const { ticker, change, price, company, market } = stock

        const stockTicker = await Ticker.create({ ticker, change, price, company, market, watchlist, user: userId })
    
        return stockTicker
    }catch(err){
        return ApiError.internal("Something went Wrong... addToWatchlist")
    }
}

tickerSchema.statics.removeFromWatchlist = async (userId, symbol) => {
    try{
        const { ticker, change, price, company } = stock

        const stockTicker = await Ticker.create({ ticker, change, price, company, watchlist, user: userId })
    
        return stockTicker
    }catch(err){
        return ApiError.internal("Something went Wrong... removeFromWatchlist")
    }
}

tickerSchema.statics.getListOfTickersToUpdate = async (userId, watchlist) => {
    try{
        
        const watchlistItems = await Ticker.find({ user: userId, watchlist}).select('ticker market')
        
        return watchlistItems
    }catch(err){
        return ApiError.internal("Something went Wrong... removeFromWatchlist")
    }
}

tickerSchema.statics.removeTickerFromWatchlist = async (userId, ticker) => {
    try{

        let stock = await Ticker.findOne({ ticker, user: userId })
        
        if(!stock){
            return ApiError.notFound('Ticker Not in Watchlist... removeTickerFromWatchlist')
        }

        if(stock.watchlist && !stock.portfolio){
            stock = await Ticker.deleteOne({ ticker, user: userId })

            return stock
        }

        stock.watchlist = undefined
        await stock.save()

        return stock

    }catch(err){
        return ApiError.internal("Something went Wrong... removeFromWatchlist")
    }
}

tickerSchema.statics.getPortfolio = async (portfolioId) => {
    try{
        const portfolio = await Ticker.find({ portfolio: portfolioId })

        return portfolio
    }catch(err){
        return ApiError.internal("Something went Wrong... getPortfolio")
    }
}

tickerSchema.statics.updateMarketValue = async (ticker, portfolioId) => {
    try{
        const stock = await Ticker.findOne({ ticker, portfolio: portfolioId })
        const value = stock.price * stock.shares

        await Ticker.findOneAndUpdate({ ticker, portfolio: portfolioId}, {marketValue: value})

        return
    }catch(err){
        return ApiError.internal("Something went Wrong... getPortfolioHoldingsValue")
    }
}

tickerSchema.statics.buyStock = async function(ticker, shares, userId, portfolioId){
    try{
        
        // Find Stock from Watchlist
        const stock = await Ticker.findOne({ ticker, user: userId })
        // Grab User Wallet to Validate Sufficient Funds
        const wallet = await Wallet.findWalletById(userId)
        // Current Market Price of Stock the User is Buying At
        const purchasePrice = +stock.price
        // The Total Valuation of Purchase
        const bookValue = +purchasePrice * +shares

        // Check to see that users has enough funds
        const sale = await wallet.sufficientFunds(bookValue)

        // If user does not currently own the stock and the sale is authorized. Create new holdings
        if(!stock.portfolio && sale){
            await Ticker.findOneAndUpdate({ ticker, user: userId }, { shares, purchasePrice, bookValue, portfolio: portfolioId })
            await wallet.decrementBalance(bookValue)

            return true
        }

        // If user already owns the stock and is buying more, add to holdings
        if(sale){
            const totalBookValue = +stock.bookValue + +bookValue
            const totalShares = +stock.shares + +shares
            const averagePurchasePrice = (totalBookValue / totalShares)
            await Ticker.findOneAndUpdate({ ticker, user: userId }, { bookValue: totalBookValue, portfolio: portfolioId, purchasePrice: averagePurchasePrice, shares: totalShares })
            await wallet.decrementBalance(bookValue)

            return true
        }

        return ApiError.badRequest("Insufficient Funds to Buy Stock...")

    }catch(err){
        return ApiError.internal("Something went Wrong... buyStock")
    }
}

tickerSchema.statics.sellStock = async function(ticker, shares, userId, portfolioId){
    try{
        // Find Stock from Watchlist
        const stock = await Ticker.findOne({ ticker, user: userId })
        // To Add Money to Users Wallet if Sale is Authorized
        const wallet = await Wallet.findWalletById(userId)
        // Total Amount the User is Selling for
        const sellValue = +stock.price * +shares

        // If the User does not own the stock, the sale is unauthorized
        if(!portfolioId){
            return ApiError.badRequest("You do Not Own the Stock...")
        }

        // Cannot sell more shares than you hold
        if(+shares > +stock.shares){
            return ApiError.badRequest("Unable to sell Shares... Exceeding Number of Shares")
        } else if(+shares === +stock.shares){
            // If selling 100% of position, deleting off of portfolio
            await Ticker.deleteOne({ ticker, user: userId })
        } else{
            // Selling a portion of position
            const newBook = +stock.bookValue - +sellValue
            const sharesAfterSale = +stock.shares - +shares
            const averagePurchasePrice = (+newBook / +sharesAfterSale)
            await Ticker.findOneAndUpdate({ ticker, user: userId }, { shares: sharesAfterSale, purchasePrice: averagePurchasePrice, bookValue: newBook })
        }

        await wallet.incrementBalance(sellValue)
        return true

    }catch(err){
        return ApiError.internal("Something went Wrong... sellStock")
    }
}

const Ticker = mongoose.model("Ticker", tickerSchema)
export default Ticker