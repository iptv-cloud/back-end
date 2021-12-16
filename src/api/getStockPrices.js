import axios from 'axios';
import cheerio from 'cheerio';
import ApiError from '../error/ApiError.js';

// Takes in an Array of Stock Tickers. Will return error if the argument passed is not in an array
// Using Axios and Cheerio to Web Scrape Stock Data from Yahoo Finance
const getStockPrices = async (tickers = []) => {

	try {
        const stockPrices = []

        // Loop through array of Stock Tickers passed in as argument
        for(let ticker of tickers){

            // The URL will differ based on which exchange the stock trades in. For simplicity it will only fetch from
            // NASDAQ, NYSE, TSX, and TSXV. US Stocks does not require a suffix while Canadian Stocks do

            let url = ""
            if(ticker.market.toUpperCase() === 'V' || ticker.market.toUpperCase() === 'TO'){
                url = `https://ca.finance.yahoo.com/quote/${ticker.ticker}.${ticker.market}`
            }else {
                url = `https://ca.finance.yahoo.com/quote/${ticker.ticker}`
            }


            // Load Webpage and Scrape
            const { data } = await axios.get(url)
            const $ = cheerio.load(data);

            // Adding suffix for Canadian Stocks while US Stocks does not require one
            if(ticker.market.toUpperCase() === 'V' || ticker.market.toUpperCase() === 'TO'){
                stockPrices.push({
                    ticker: `${ticker.ticker}.${ticker.market}`,
                    company: $('h1[class="D(ib) Fz(18px)"]').text().trim(),
                    price: $('span[class="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)"]').text().trim(),
                    change: $('div[class="D(ib) Mend(20px)"] span[data-reactid="33"]').text().trim(),
                    market: ticker.market.toUpperCase()
                })
            }else{
                stockPrices.push({
                    ticker: `${ticker.ticker}`,
                    company: $('h1[class="D(ib) Fz(18px)"]').text().trim(),
                    price: $('span[class="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)"]').text().trim(),
                    change: $('div[class="D(ib) Mend(20px)"] span[data-reactid="33"]').text().trim(),
                    market: ticker.market.toUpperCase()
                })
            }
        }

        return stockPrices
  } catch (err) {
        return ApiError.internal("Unable to Fetch Data from API...")
  }
}

export default getStockPrices;