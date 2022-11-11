import {FastifyReply} from 'fastify';
import {IDynamicRoute} from '@/utils/loader';
import {IRequest} from '@/utils/def.request';

const post: IDynamicRoute = {
    schema: {
        body: {
            type: 'object',
            properties: {
                username: {type: 'string'},
                password: {type: 'string'}
            },
            required: ['username', 'password']
        }
    },

    handler: (_request: IRequest, response: FastifyReply) =>
    {
        response.send({result: true});
    }
};

export default post;