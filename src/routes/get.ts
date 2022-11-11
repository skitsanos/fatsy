import {ILoadableHandler} from '@/utils/loader';
import {IRequest} from '@/utils/def.request';
import {FastifyReply} from 'fastify';

const get: ILoadableHandler = {

    handler: (_request: IRequest, response: FastifyReply) =>
    {
        //response.send({debug: process.env['NODE_ENV'] !== 'production', config});
        //response.code(200);
        response.view('layout', {user: 'John'});
    }
};

export default get;