import { promisify } from 'util';
import redisClient from '../database/redis.js';

export const GET_ASYNC = promisify(redisClient.get).bind(redisClient)
export const SET_ASYNC = promisify(redisClient.set).bind(redisClient)
export const FLUSHALL_ASYNC = promisify(redisClient.flushall).bind(redisClient)