import {IDynamicRoute} from '@/utils/loader';
import {IRequest} from '@/utils/def.request';
import {FastifyReply} from 'fastify';

const get: IDynamicRoute = {
    handler: (_request: IRequest, response: FastifyReply) =>
    {
        //response.send({debug: process.env['NODE_ENV'] !== 'production', config});

        //const ver = await request.jwtVerify()
        //console.log(request.user)
        response.view('layout', {user: 'John'});
    }
};

export default get;