/**
 * Fatsy - Fastify Server Template done in TypeScript
 * @version 1.0.20221018
 * @author skitsanos, https://github.com/skitsanos
 */
import Fastify, {FastifyError, FastifyInstance, FastifyReply, HookHandlerDoneFunction} from 'fastify';
import {join as pathJoin} from 'path';
import fileUpload from 'fastify-file-upload';
import loadConfig from '@/utils/loadConfig';
import loader from '@/loader';
import {IRequest} from '@/utils/de.request';

const config = loadConfig(pathJoin(__dirname, '..', 'config', 'default.yaml'));

const fastify: FastifyInstance = Fastify({
    logger: config.server.logger
});

fastify.decorateRequest('config', null);
fastify.addHook('preHandler', (req: IRequest, _res: FastifyReply, done: HookHandlerDoneFunction) =>
{
    req.config = config;
    done();
});

fastify.register(fileUpload);

fastify.addHook('onRequest', (_req: IRequest, res: FastifyReply, done: HookHandlerDoneFunction) =>
{
    res.header('server', config.app?.title);
    /*
	 * Helps prevent browsers from trying to guess (“sniff”) the MIME type, which can have security implications.
	 */
    res.header('X-Content-Type-Options', 'nosniff');
    /*
	 * The X-DNS-Prefetch-Control header tells browsers whether they should do DNS prefetching. Turning it on may
	 * not work—not all browsers support it in all situations—but turning it off should disable it on all
     * supported browsers.
	 */
    res.header('X-DNS-Prefetch-Control', 'off');
    /*
	 * The X-Frame-Options header tells browsers to prevent your webpage from being put in an iframe. When
	 * browsers load iframes, they’ll check the value of the X-Frame-Options header and abort loading
	 * if it’s not allowed
	 */
    res.header('X-Frame-Options', 'DENY');
    done();
});

fastify.setErrorHandler((error: FastifyError, _, response: FastifyReply) =>
{
    const {message, statusCode} = error;

    response.code(statusCode as number).send({
        error: {
            message
        },
        ...process.env['NODE_ENV'] !== 'production' && {
            debug: {
                statusCode
            }
        }
    });
});


loader(pathJoin(__dirname, 'routes'), fastify);

fastify.listen({
    port: config.server.port,
    host: config.server.host
}).then(() =>
{
    fastify.log.info('Up and running');
}).catch(err =>
{
    if (err)
    {
        fastify.log.error(err);
    }
});