import {FastifyReply} from 'fastify';
import {ILoadableHandler} from '@/loader';
import {IRequest} from '@/utils/def.request';

const post: ILoadableHandler = {
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