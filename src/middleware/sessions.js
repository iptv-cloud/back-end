import session from 'express-session';
import connectRedis from 'connect-redis';
import redisClient from '../database/redis.js'

const RedisStore = connectRedis(session)

const { SESSION_SECRET, SESSION_EXPIRY } = process.env
const sessionOptions = {
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    name: "sessionID",
    cookie: {
        secure: false,
        sameSite: false,
        httpOnly: true,
        maxAge: +SESSION_EXPIRY
    }
}

export default session(sessionOptions)
