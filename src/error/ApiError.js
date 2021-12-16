
class ApiError extends Error{
    constructor(code, message){
        super(message)
        this.code = code
    }

    static badRequest(msg){
        return new ApiError(400, msg)
    }

    static unauthorized(msg){
        return new ApiError(401, msg)
    }

    static forbidden(msg){
        return new ApiError(403, msg)
    }

    static notFound(msg){
        return new ApiError(404, msg)
    }

    static internal(msg){
        return new ApiError(500, msg);
    }
}

export default ApiError;