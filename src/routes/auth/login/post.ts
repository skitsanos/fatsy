import {fastify, FastifyReply, FastifyRequest, RouteHandlerMethod} from 'fastify';
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

    handler: (request: FastifyRequest, response: FastifyReply):RouteHandlerMethod =>
    {
        const {username, password} = request.body;
        //const token = fastify.jwt.sign({username});
        console.log(Object.keys(this))

        response.send({result: {}});
    }
};

export default post;