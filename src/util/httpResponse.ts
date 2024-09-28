import { Request, Response } from 'express';
import config from '../config/config';
import { THttpResponse } from '../types/types'
import { EApplicationEnvironment } from '../constant/application';

export default (req: Request, res: Response, responseStatusCode: number, responseMessage: string, data: unknown = null): void => {
    const response: THttpResponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            ip: req.ip,
            method: req.method,
            url: req.originalUrl
        },
        message: responseMessage,
        data: data
    }
    //log
    // eslint-disable-next-line no-console
    console.log('CONTROLLER_RESPONSE', { meta: response });

    //Prodection Env check
    if(config.ENV === EApplicationEnvironment.PRODUCTION){
        delete response.request.ip;
    }

    res.status(responseStatusCode).json(response);
}

