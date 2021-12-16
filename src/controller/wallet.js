import Wallet from "../model/wallet.js";
import ApiError from '../error/ApiError.js'

// User Wallet is Initialized Upon Registration

export const getUserWallet = async (req, res, next) => {
    
    // GET: USER WALLET
    
    try{

        // UserId saved into Session Cookie
        const { userId } = req.session
        
        // Find Wallet Tied to the User
        const wallet = await Wallet.findWalletById(userId)

        res.send(wallet)

    }catch(err){
        return ApiError.internal("Something went Wrong... getUserWallet")
    }
}

export const loadBalance = async (req, res, next) => {

    // POST: LOAD BALANCE

    try{
        // Amount to Load Balance by. Sent in Client Request
        const { amount } = req.body
        const { userId } = req.session

        // Check to see User Wallet exists
        let wallet = await Wallet.findWalletById(userId)

        // Send Error if Database Query Unsuccessful
        if(wallet instanceof ApiError){
            return next(wallet)
        }

        // If no wallet is found, send error message
        if(!wallet){
            return next(ApiError.badRequest('Unablet to Process Request...'))
        }

        // Else, Increment balance by requested amount
        wallet = await wallet.incrementBalance(+amount)

        // If error in Database query, send error
        if(wallet instanceof ApiError){
            return next(wallet)
        }

        // Send new wallet balance
        res.send(wallet)
        
    }catch(err){
        return ApiError.internal("Something went Wrong... loadBalance")
    }
}

export const unloadBalance = async (req, res, next) => {

    // POST: UNLOAD BALANCE

    try{
        // Amount to Unload Balance by. Sent in Client Request
        const { amount } = req.body
        const { userId } = req.session

        // Check for User Wallet
        let wallet = await Wallet.findWalletById(userId)

        // If Error in Database Query, return Error
        if(wallet instanceof ApiError){
            return next(wallet)
        }

        // If User Wallet Not Found, send error message
        if(!wallet){
            return next(ApiError.badRequest('Unablet to Process Request...'))
        }

        // Decrement Balance by specified Amount
        wallet = await wallet.decrementBalance(+amount)

        // If Error in Decrementing Balance, send error
        if(wallet instanceof ApiError){
            return next(wallet)
        }

        // Else, send wallet with new balance
        res.send(wallet)
    }catch(err){
        return ApiError.internal("Something went Wrong... unloadBalance")
    }
}