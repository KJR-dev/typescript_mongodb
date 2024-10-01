import app from './app'
import config from './config/config'
import { initRateLimiter } from './config/rateLimter'
import databaseService from './service/databaseService'
import logger from './util/logger'

const server = app.listen(config.PORT)

// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
    try {
        //Database Conntion
        const connection = await databaseService.connect()
        logger.info('DATABASE_NAME', {
            meta: {
                CONNECTION_NAME: connection.name
            }
        })

        initRateLimiter(connection)
        logger.info('RATE_LIMITER_INITIAED')

        logger.info(`APPLICATION_STARTD`, {
            meta: {
                PORT: config.PORT,
                SERVER_URL: config.SERVER_URL
            }
        })
    } catch (error) {
        logger.info(`APPLICATION_ERROR`, { meta: error })
        server.close((error) => {
            if (error) {
                logger.info(`APPLICATION_ERROR`, { meta: error })
            }
            process.exit(1)
        })
    }
})()

