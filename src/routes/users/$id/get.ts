import {FastifyReply, FastifyRequest} from 'fastify';

const get = {

    handler: (request: FastifyRequest, response: FastifyReply) =>
    {
        response.send({result: 'get user by id'});
    }
};

export default get;