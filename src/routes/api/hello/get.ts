import {FastifyReply, FastifyRequest} from 'fastify';
import {FatsyDynamicRoute, FatsyRouteUtils} from '@/utils/loader';
import apiResponse from '@/utils/apiResponse';

const get: FatsyDynamicRoute = {
    handler: (_request: FastifyRequest, response: FastifyReply, utils: FatsyRouteUtils) =>
    {
        const {
            log,
            config
        } = utils;

        const {config: appConfig} = config;

        log.info('Got hello handler');

        apiResponse(response, 200, {
            debug: process.env['NODE_ENV'] !== 'production',
            appConfig
        });
    }
};

export default get;