import Fastify, {FastifyError, FastifyInstance, FastifyReply} from 'fastify';
import {join as pathJoin} from 'path';
import loader from './loader';
import fileUpload from 'fastify-file-upload';

const fastify: FastifyInstance = Fastify({
    logger: true
});

fastify.register(fileUpload);

fastify.setErrorHandler((error: FastifyError, _, response: FastifyReply) =>
{
    const {message, statusCode} = error;

    response.code(statusCode as number).send({
        error: {
            message
        },
        ...process.env.NODE_ENV !== 'production' && {
            debug: {
                statusCode
            }
        }
    });
});


loader(pathJoin(__dirname, 'routes'), fastify);

fastify.listen({
    port: 3000,
    host: '0.0.0.0'
});