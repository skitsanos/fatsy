import {FastifyReply, FastifyRequest} from 'fastify';
import {ILoadableHandler} from '@/loader';

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

    handler: (_request: FastifyRequest, response: FastifyReply) =>
    {
        response.send({result: true});
    }
};

export default post;