import {FastifyReply, FastifyRequest} from 'fastify';

const get = {

    handler: (_request: FastifyRequest, response: FastifyReply) =>
    {
        response.send({hello: 'World!!'});
    }
};

export default get;