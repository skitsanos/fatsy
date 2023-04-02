import {FatsyDynamicRoute} from '@/utils/loader';
import {FastifyReply, FastifyRequest} from 'fastify';

const post: FatsyDynamicRoute = {
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

    handler: (request: FastifyRequest, response: FastifyReply, utils) =>
    {
        const {username} = request.body as Record<string, string>;

        const {jwt} = utils;

        response.send({
            result: {
                token: jwt.sign({username})
            }
        });
    }
};

export default post;