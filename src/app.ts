import express, { Application, NextFunction } from 'express'
import path from 'path'
import router from './router/apiRouter'
import gobalErrorHandler from './middleware/gobalErrorHandler'
import responseMessage from './constant/responseMessage'
import httpError from './util/httpError'
import { Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'

const app: Application = express()

//Middleware
app.use(helmet()) //Helmet
app.use(
    cors({
        methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTION', 'HEAD'],
        origin: ['https://client.com'],
        credentials: true
    })
)
app.use(express.json())
app.use(express.static(path.join(__dirname, '../', 'public')))

//Routes
app.use('/api/v1', router)

//404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
    try {
        throw new Error(responseMessage.NOT_FOUND('route'))
    } catch (error) {
        httpError(next, error, req, 404)
    }
})

//Gobal Error Handle
app.use(gobalErrorHandler)

export default app

