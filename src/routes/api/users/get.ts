import {FastifyReply, FastifyRequest} from 'fastify';
import {FatsyDynamicRoute} from '@/utils/loader';

const get: FatsyDynamicRoute = {
    private: true,

    handler: (_request: FastifyRequest, response: FastifyReply, _utils) =>
    {
        response.send({
            result: 'get users'
        });
    }
};

export default get;