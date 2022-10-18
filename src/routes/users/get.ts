import {FastifyReply, FastifyRequest} from 'fastify';

const get = {

    handler: (request: FastifyRequest, response: FastifyReply) =>
    {
        response.send({result: 'get users'});
    }
};

export default get;