import {FastifyReply} from 'fastify';
import {IRequest} from '@/utils/def.request';

const get = {
    handler: (_request: IRequest, response: FastifyReply) =>
    {
        response.send({hello: 'World!!'});
    }
};

export default get;