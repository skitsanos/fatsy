import {FastifyReply} from 'fastify';
import {IRequest} from '@/utils/def.request';

const get = {
    handler: (request: IRequest, response: FastifyReply) =>
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