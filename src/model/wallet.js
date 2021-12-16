import mongoose from 'mongoose';
import ApiError from '../error/ApiError.js';

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    balance: {
        type: Number,
        default: 10000
    }
})

walletSchema.statics.createUserWallet = async (userId) => {
    try{
        const wallet = await Wallet.create({ user: userId })

        return wallet

    }catch(err){
        return ApiError.internal("Something went Wrong... createUserWallet")
    }
}

walletSchema.statics.findWalletById = async (userId) => {
    try{
        const wallet = await Wallet.findOne({ user: userId })

        return wallet
    }catch(err){
        return ApiError.internal("Something went Wrong... findWalletById")
    }
}

walletSchema.methods.incrementBalance = async function(amount){
    try{
        const user = this
        
        user.balance+=amount
        await user.save()

        return user;
    }catch(err){
        return ApiError.internal("Something went Wrong... incrementBalance")
    }
}

walletSchema.methods.decrementBalance = async function(amount){
    try{

        const user = this
        
        if(user.balance - amount < 0){
            return ApiError.badRequest('You have Not Enough Minerals...')
        }

        user.balance-=amount
        await user.save()

        return user
    }catch(err){
        return ApiError.internal("Something went Wrong... decrementBalance")
    }
}

walletSchema.methods.sufficientFunds = async function(purchasePrice){
    try{
        const user = this

        if(user.balance >= purchasePrice){
            return true
        }else{
            return false
        }
    }catch(err){
        return ApiError.internal("Something went Wrong... sufficientFunds")
    }
}

const Wallet = mongoose.model("Wallet", walletSchema)
export default Wallet