import bcrypt from "bcryptjs";
import ApiError from "../error/ApiError.js"
import Portfolio from "../model/portfolio.js";
import User from '../model/user.js';
import Wallet from "../model/wallet.js";
import Watchlist from "../model/watchlist.js";

export const userRegister = async (req, res, next) => {
    try{

        // POST: REGISTER NEW USER

        const { email, username, password, confirm } = req.body
        const { HASHING_SALT } = process.env

        // Quick Validation of Input Fields. Send Error Back if empty fields or Password and Confirm Password Does not Match
        if(!email || !username || !password || (password != confirm)){
            return next(ApiError.badRequest('Please Verify All Input Fields...'))
        }

        // Check to see Email is not already in use
        const inUse = await User.findUserByEmail(email)

        // If Email is already in use. Send Error
        if(inUse){
            return next( ApiError.internal('Email already in use...'))
        }

        // Final Step to Validate User Password. Using bcryptjs to hash and store password
        const hashedPw = await bcrypt.hash(password, +HASHING_SALT)
        const user = await User.createNewUser(email, username, hashedPw)

        // Send error if User is not created
        if(user instanceof ApiError){
            return next(user)
        }

        // If User Successfully Registered. Initialize new Instance of Wallet, Portfolio, and Watchlist
        await Wallet.createUserWallet(user._id)
        await Portfolio.initializePortfolio(user._id)
        await Watchlist.initializeWatchlist(user._id)

        // If All Validation is Passed. Send Status of 201 CREATED
        res.sendStatus(201)
    }catch(err){
        next(ApiError.internal('Something went Wrong... (Registering User)'))
    }
}

export const userLogin = async (req, res, next) => {
    try{

        // POST USER LOGIN
        
        const { email, password } = req.body
        
        // Empty Input Fields, Send Back Error Message
        if(!email | !password){
            return next(ApiError.forbidden("Please Provide Email and Password..."))
        }

        // Look for User in Database
        const user = await User.findUserByEmail(email)

        // If Database Query fails send Error
        if(user instanceof ApiError){
            return next(user)
        }

        // If Wrong Email Input, send Error
        if(!user){
            return next(ApiError.forbidden('Failed to Log In Please Try Again... (Email not Found)'))
        }

        // Validate User Input Password with Stored Hashed Password using Bcrypt compare
        const userCredentials = await user.getUserCredentials()
        const match = await bcrypt.compare(password, userCredentials)

        // If Validated, Set Cookie, and Send Status 200
        if(match){
            // Storing User Id for Session Authenticating
            req.session.userId = user._id

            return res.sendStatus(200)
        }

        next()
        
    }catch(err){
        next(ApiError.internal('Something went Wrong... (Login User)'))
    }
}

export const userLogout = async (req, res, next) => {
    try{

        // POST USER LOGOUT

        // Destory User Session
        req.session.destory
        
        // Clear Cookie on Client and Send Status 200
        res.clearCookie('sessionID')
        res.sendStatus(200)
    }catch(err){
        next(ApiError.internal('Something went Wrong... (Logout User)'))
    }
}