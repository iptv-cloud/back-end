import ApiError from '../error/ApiError.js';
import checkSessionCache from '../service/cache.js';


const authenticate = async (req, res, next) => {
    try{

        const { userId, id } = req.session
        const session = await checkSessionCache(id)

        if(!session || !userId){
            return next(ApiError.unauthorized('Unauthorized Request...'))
        }

        if(session.userId === userId){
            return next()
        }

        next(ApiError.unauthorized('Unauthorized Request...'))

    }catch(err){
        return next(ApiError.internal('Something went Wrong... Authenticate'))
    }
}

export default authenticate;