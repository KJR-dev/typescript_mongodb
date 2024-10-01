import { NextFunction, Request, Response } from 'express'
import { rateLimiterMongo } from '../config/rateLimter'
import responseMessage from '../constant/responseMessage'
import httpError from '../util/httpError'
import config from '../config/config'
import { EApplicationEnvironment } from '../constant/application'

// Update middleware to accept custom points
const rateLimit = (points: number) => {
    return (req: Request, _: Response, next: NextFunction) => {
        if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
            return next()
        }
        if (rateLimiterMongo) {
            rateLimiterMongo
                .consume(req.ip as string, points) // Use custom points
                .then(() => {
                    next()
                })
                .catch(() => {
                    httpError(next, new Error(responseMessage.TOO_MANY_REQUEST), req, 429)
                })
        } else {
            next()
        }
    }
}

export default rateLimit

