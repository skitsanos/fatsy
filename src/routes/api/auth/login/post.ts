import {IDynamicRoute} from '@/utils/loader';
import {FastifyReply, FastifyRequest} from 'fastify';

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

    handler: (request: FastifyRequest, response: FastifyReply) =>
    {
        const {username, password} = request.body as Record<string, string>;

        const {jwt} = response;

        response.send({
            result: {
                token: jwt.sign({username})
            }
        });
    }
};

export default post;