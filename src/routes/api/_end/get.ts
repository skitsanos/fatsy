import {FastifyReply, FastifyRequest} from 'fastify';
import {FatsyDynamicRoute, FatsyRouteUtils} from '@/utils/loader';
import apiResponse from '@/utils/apiResponse';

const get: FatsyDynamicRoute = {
    handler: (_request: FastifyRequest, response: FastifyReply, _utils: FatsyRouteUtils) =>
    {
        apiResponse(response, 200, {});

        setTimeout(() =>
        {
            process.exit(0);
        }, 1000);
    }
};

export default get;