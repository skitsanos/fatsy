import {FatsyDynamicRoute} from '@/utils/loader';
import {FastifyReply, FastifyRequest} from 'fastify';

const get: FatsyDynamicRoute = {
    handler: (_request: FastifyRequest, response: FastifyReply) =>
    {
        //response.send({debug: process.env['NODE_ENV'] !== 'production', config});

        //const ver = await request.jwtVerify()
        //console.log(request.user)
        response.view('layout', {user: 'John'});
    }
};

export default get;