import getStockPrices from '../api/getStockPrices.js';
import Ticker from '../model/ticker.js';
import Watchlist from '../model/watchlist.js';
import ApiError from '../error/ApiError.js'

export const getWatchlist = async (req, res, next) => {

    // GET : GET USER WATCHLIST

    try{
        // Find Watchlist using UserId from Session Cookie
        const { userId } = req.session
        const watchlistId = await Watchlist.findWatchlistById(userId)
        const watchlist = await Ticker.getWatchlist(watchlistId)

        // If there is an error fetching from the database, send error message
        if(watchlistId instanceof ApiError || watchlist instanceof ApiError){
            return next(ApiError.internal("Something went Wrong... getWatchlist"))
        }

        res.send(watchlist)

    }catch(err){
        next(ApiError.internal('Something went Wrong... getWatchlist'))        
    }
}

export const addToWatchlist = async (req, res, next) => {

    // POST : Add New Ticker to Watchlist

    try{
        // Find Watchlist using UserId from Session Cookie
        // The Client will need to provide the Ticker symbol to add and the exchange it trades on EX: NASDAQ || NYSE
        const { userId } = req.session
        const { ticker, market } = req.body
        let watchlist = await Watchlist.findWatchlistById(userId)
        const duplicate = await Ticker.findOne({ ticker: ticker, user: userId })

        // Check to see if Ticker is already in Watchlist
        // Only Add if it is not present
        if(!duplicate){
            const stock = await getStockPrices([{ticker, market}])

            // Fomartting Data to be Compatible with the Document Ticker Model
            const stockData = {
                ticker: stock[0].ticker,
                company: stock[0].company,
                price: +stock[0].price.replace(",", ""),
                change: stock[0].change,
                market: stock[0].market
            }
            
            // Add new Ticker to Watchlist and send New Watchlist to Client
            const stockTicker = await Ticker.addToWatchlist(userId, watchlist._id, stockData)
            watchlist = await Ticker.getWatchlist(watchlist._id)
    
            return res.send(watchlist)
        }

        // Will send error message if Ticker already exists
        next(ApiError.badRequest("Ticker Already in Watchlist..."))

    } catch(err){
        next(ApiError.internal('Something went Wrong... addToWatchlist'))
    }
}

export const removeFromWatchlist = async (req, res, next) => {

    // POST : REMOVE A TICKER FROM WATCHLIST

    try{
        const { userId } = req.session
        const { ticker } = req.body

        // Remove a ticker from the watchlist using userId and ticker symbol. Ticker is provided by the Client Request
        let watchlist = await Ticker.removeTickerFromWatchlist(userId, ticker)

        // If Error or Ticker does not exist in the watchlist, send error message
        if(watchlist instanceof ApiError){
            return next(watchlist)
        }

        // Else send updated Watchlist to Client
        const watchlistId = await Watchlist.findWatchlistById(userId)
        watchlist = await Ticker.getWatchlist(watchlistId)

        res.send(watchlist)

    }catch(err){
        next(ApiError.internal("Something went Wrong... removeFromWatchlist"))
    }
}

export const updateWatchlistPrices = async (req, res, next) => {

    // POST : UPDATE WATCHLIST PRICES

    try{
        // Find Requesting User and Watchlist
        const { userId } = req.session
        let watchlistId = await Watchlist.findWatchlistById(userId)
        
        // Grabs all related Tickers within the Watchlist and returns the stock Ticker Symbol and the Exchange
        const watchlist = await Ticker.getListOfTickersToUpdate(userId, watchlistId)

        // Using the above query, fetch updated data from Yahoo Finance API Webscrape
        const stocks = await getStockPrices(watchlist)

        // Loop through above query and save new stock prices to the database
        for(let stock of stocks){
            await Ticker.updateSharePrice(stock)
        }

        // Send new stock data to Client
        res.send(stocks)

    } catch(err){
        next(ApiError.internal('Something went Wrong... updateWatchlistPrices'))
    }
}