import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import {FastifyPluginOptions, FastifyReply, FastifyRequest} from 'fastify';

export default fp(async (fastify, opts: FastifyPluginOptions) =>
{
    fastify.register(fastifyJwt, {
        secret: opts['secret']
    });

    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) =>
    {
        console.log('checking')
        try
        {
            await request.jwtVerify();
        }
        catch (err)
        {
            reply.send(err);
        }
    });
});