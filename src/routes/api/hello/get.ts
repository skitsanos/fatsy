import {FastifyReply, FastifyRequest} from 'fastify';

const get = {
    handler: (request: FastifyRequest, response: FastifyReply) =>
    {
        const {config, log} = request;

        log.info('Got hello handler');

        response.send({
            debug: process.env['NODE_ENV'] !== 'production',
            config
        });
    }
};

export default get;