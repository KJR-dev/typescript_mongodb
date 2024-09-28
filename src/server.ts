import app from './app'
import config from './config/config'
import logger from './util/logger';

const server = app.listen(config.PORT)

;(() => {
    try {
        //Database Conntion
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

