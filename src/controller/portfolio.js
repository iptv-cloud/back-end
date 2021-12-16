import getStockPrices from '../api/getStockPrices.js';
import Portfolio from '../model/portfolio.js';
import ApiError from '../error/ApiError.js';
import Ticker from '../model/ticker.js';

export const getPortfolio = async (req, res, next) => {

    // GET : GET PORTFOLIO

    try{
        // Find User and Portfolio ID
        const { userId } = req.session
        const portfolioId = (await Portfolio.findPortfolioById(userId))._id

        // If Error in Fetching from DB Send Error
        if(portfolioId instanceof ApiError){
            return next(portfolioId)
        }

        // Find all Portfolio Tickers
        const portfolio = await Ticker.getPortfolio(portfolioId)

        // If Error in Fetching from DB Send Error
        if(portfolio instanceof ApiError){
            return next(portfolio)
        }

        // Check to see if Portfolio is empty
        if(portfolio.length === 0){
            return res.send(portfolio)
        }

        // If not empty, further data manipulation
        
        // Need to Update Stock Prices by Fetching from Webscrape API
        const stocks = await getStockPrices(portfolio)

        // Loop through above query and save new stock prices to the database
        // Also update new Market Value of Holdings
        for(let stock of stocks){
            await Ticker.updateSharePrice(stock)
            await Ticker.updateMarketValue(stock.ticker, portfolioId)
        }

        // Portfolio with Updated Values
        res.send(portfolio)

    }catch(err){
        next(ApiError.internal("Something went Wrong... getPortfolio"))
    }
}

export const buyAStock = async (req, res, next) => {

    // POST : BUY A STOCK

    try{
        // Client Request must provide the Ticker, Exchange, and Number of Shares
        const { userId } = req.session
        const { ticker, market, shares } = req.body
        const portfolioId = (await Portfolio.findPortfolioById(userId))._id

        // Getting the most recent stock price for purchase
        const stock = (await getStockPrices([{ ticker, market }]))[0]
        await Ticker.updateSharePrice(stock)

        const sale = await Ticker.buyStock(ticker, shares, userId, portfolioId)
        if(sale instanceof ApiError){
            return next(sale)
        }
        // Get Updated Portfolio
        const portfolio = await Ticker.getPortfolio(portfolioId)
        res.send(portfolio)

    }catch(err){
        next(ApiError.internal("Something went Wrong... buyAStock"))
    }
}

export const sellAStock = async (req, res, next) => {

   // POST : SELL A STOCK

   try{
        // Client Request must provide the Ticker, Exchange, and Number of Shares
        const { userId } = req.session
        const { ticker, market, shares } = req.body
        const portfolioId = (await Portfolio.findPortfolioById(userId))._id

        // Getting the most recent stock price for purchase
        const stock = (await getStockPrices([{ ticker, market }]))[0]
        await Ticker.updateSharePrice(stock)

        const sale = await Ticker.sellStock(ticker, shares, userId, portfolioId)
        if(sale instanceof ApiError){
            return next(sale)
        }
        // Get Updated Portfolio
        const portfolio = await Ticker.getPortfolio(portfolioId)
        
        res.send(portfolio)

    }catch(err){
        next(ApiError.internal("Something went Wrong... sellAStock"))
    }
}

