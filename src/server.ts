import app from './app'
import config from './config/config'

const server = app.listen(config.PORT)

;(() => {
    try {
        //Database Conntion
         // eslint-disable-next-line no-console
        console.info(`APPLICATION_STARTD`, {
            meta: {
                PORT: config.PORT,
                SERVER_URL: config.SERVER_URL
            }
        })
    } catch (error) {
         // eslint-disable-next-line no-console
        console.log(`APPLICATION_ERROR`, { meta: error })
        server.close((error) => {
            if (error) {
                 // eslint-disable-next-line no-console
                console.log(`APPLICATION_ERROR`, { meta: error })
            }
            process.exit(1)
        })
    }
})()

