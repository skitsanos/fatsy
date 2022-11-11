import {FastifyReply} from 'fastify';
import {IDynamicRoute} from '@/utils/loader';
import {IRequest} from '@/utils/def.request';

const post: IDynamicRoute = {
    schema: {
        body: {
            type: 'object',
            properties: {
                file: {type: 'object'}
            },
            required: ['file']
        }
    },

    handler: (request: IRequest, response: FastifyReply) =>
    {
        // More details on:
        //https://github.com/huangang/fastify-file-upload#readme
        //
        const {file} = request.body as Record<string, any>;

        response.send({
            result: {
                name: file.name,
                size: file.size,
                type: file.mimetype
            }
        });
    }
};

export default post;