import {FastifyReply, FastifyRequest} from 'fastify';
import {ILoadableHandler} from '@/loader';

const get: ILoadableHandler = {

    handler: (request: FastifyRequest, response: FastifyReply) =>
    {
        response.send({debug: process.env.NODE_ENV !== 'production'});
    }
};

export default get;