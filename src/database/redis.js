import redis from 'redis';
import ApiError from '../error/ApiError.js';

const { REDIS_PORT, REDIS_HOST } = process.env

const redisOptions = {
    host: REDIS_HOST,
    port: REDIS_PORT
}

const redisClient = redis.createClient(redisOptions)

redisClient.on('connect', () => {
    console.log("Connected to Redis...")
})

redisClient.on('error', () => {
    console.error(ApiError.internal('Connection Refused... REDIS'))
})

export default redisClient