import {FastifyReply} from 'fastify';
import {IRequest} from '@/utils/def.request';
import {IResponse} from '@/utils/def.response';

const get = {
    onRequest: async (request: IRequest, response: IResponse) =>
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
    handler: (_request: IRequest, response: FastifyReply) =>
    {
        response.send({result: 'get users'});
    }
};

export default get;