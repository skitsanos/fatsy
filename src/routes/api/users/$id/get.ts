import {FastifyReply, FastifyRequest} from 'fastify';
import {FatsyDynamicRoute} from '@/utils/loader';

const get: FatsyDynamicRoute = {
    private: true,

    handler: (_request: FastifyRequest, response: FastifyReply) =>
    {
        response.send({result: 'get user by id'});
    }
};

export default get;