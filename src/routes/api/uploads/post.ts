import {FastifyReply, FastifyRequest} from 'fastify';
import {FatsyDynamicRoute} from '@/utils/loader';

const post: FatsyDynamicRoute = {
    schema: {
        body: {
            type: 'object',
            properties: {
                file: {type: 'object'}
            },
            required: ['file']
        }
    },

    handler: (request: FastifyRequest, response: FastifyReply) =>
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