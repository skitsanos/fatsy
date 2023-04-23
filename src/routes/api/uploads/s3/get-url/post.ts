import {FastifyReply, FastifyRequest} from 'fastify';
import {FatsyDynamicRoute} from '@/utils/loader';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

const post: FatsyDynamicRoute = {
    schema: {
        body: {
            type: 'object',
            properties: {
                file: {type: 'string'}
            },
            required: ['file']
        }
    },

    handler: async (request: FastifyRequest, response: FastifyReply, utils) =>
    {
        const {config: configUtil} = utils;
        const {config} = configUtil;

        if (!config?.s3)
        {
            response
                .code(400)
                .send({
                    error: {
                        message: 'S3 configuration is missing'
                    }
                });
            return;
        }

        const {
            credentials,
            endpoint
        } = config.s3;

        const client = new S3Client({
            endpoint,
            forcePathStyle: true,
            credentials: {
                // accessKeyId,
                // secretAccessKey
                ...credentials
            }
        });

        const {file} = request.body as Record<string, string>;

        const command = new PutObjectCommand({
            Bucket: 'demo',
            Key: file
        });

        const url = await getSignedUrl(client, command, {expiresIn: 3600});

        response.send({
            result: url
        });
    }
};

export default post;