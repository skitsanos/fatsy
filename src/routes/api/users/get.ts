import {FastifyReply, FastifyRequest} from 'fastify';
import {FatsyDynamicRoute} from '@/utils/loader';

const get: FatsyDynamicRoute = {
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
    handler: (request: FastifyRequest, response: FastifyReply, utils) =>
    {
        const {username} = request.user as Record<string, any>;

        utils.log.info(`User: ${username}`);

        response.send({
            result: 'get users'
        });
    }
};

export default get;