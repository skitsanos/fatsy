import {FastifyReply, FastifyRequest} from 'fastify';
import {IDynamicRoute} from '@/utils/loader';

const get: IDynamicRoute = {
    onRequest: async (request: FastifyRequest, response: FastifyReply) =>
    {
        try
        {
            await request.jwtVerify();
        }
        catch (err)
        {
            response.send(err);
        }
    },
    handler: (request: FastifyRequest, response: FastifyReply) =>
    {
        const {username} = request.user as Record<string, any>;

        request.log.info(`User: ${username}`);

        response.send({
            result: 'get users'
        });
    }
};

export default get;