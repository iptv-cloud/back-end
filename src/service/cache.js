import ApiError from '../error/ApiError.js';
import { GET_ASYNC } from '../model/cache.js';

const checkSessionCache = async (sessionId) => {
    try{
        const id = `sess:${sessionId}`
        const session = await GET_ASYNC(id)
        if(!session){
            return ApiError.unauthorized('Unauthorized Request...')
        }
        return JSON.parse(session)
    }catch(err){
        return ApiError.internal("Something went Wrong... checkSessionCache")
    }
}

export default checkSessionCache