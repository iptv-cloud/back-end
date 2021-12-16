import mongoose from 'mongoose';
import ApiError from '../error/ApiError.js';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    }
})

userSchema.statics.createNewUser = async (email, username, password) => {
    try{
        const user = await User.create({ email, username, password })
        
        return user

    }catch(err){
        return ApiError.internal('Something went Wrong... (createNewUser)')
    }
}

userSchema.statics.findUserById = async (id) => {
    try{
        const user = await User.findOne({_id: id})

        return user
    }catch(err){
        return ApiError.internal('Something went Wrong... (findUserById)')
    }
}

userSchema.statics.findUserByEmail = async (email) => {
    try{
        const user = await User.findOne({email})

        return user
    }catch(err){
        return ApiError.internal('Something went Wrong... (findUserByEmail)')
    }
}

userSchema.methods.getUserCredentials = async function(){
    try{
        return this.password
    }catch(err){
        return ApiError.internal('Something went Wrong... (getUserCredentials)')
    }
}

const User = mongoose.model("User", userSchema);
export default User;