import {FastifyReply} from 'fastify';
import {ILoadableHandler} from '@/loader';
import {IRequest} from '@/utils/de.request';

const get: ILoadableHandler = {

    handler: (request: IRequest, response: FastifyReply) =>
    {
        const {config} = request;

        response.send({debug: process.env['NODE_ENV'] !== 'production', config});
    }
};

export default get;