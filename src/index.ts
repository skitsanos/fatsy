/**
 * Fatsy - Fastify Server Template done in TypeScript
 * @version 1.0.20221110
 * @author skitsanos, https://github.com/skitsanos
 */
import Fastify, {FastifyError, FastifyInstance, FastifyReply, HookHandlerDoneFunction} from 'fastify';
import {join as pathJoin, isAbsolute} from 'path';
import fileUpload from 'fastify-file-upload';
import fastifyJwt from '@fastify/jwt';
import fastifyView from '@fastify/view';
import loader from '@/utils/loader';
import {IRequest} from '@/utils/def.request';
import ApplicationConfiguration from '@skitsanos/app-config';
import {IResponse} from '@/utils/def.response';
//import pluginAuthenticate from '@/plugins/auth';

const appConfig = new ApplicationConfiguration();
appConfig.load(pathJoin(__dirname, '..', 'config'));

const {config}: Record<string, any> = appConfig;

const fastify: FastifyInstance = Fastify({
    logger: config.server.logger
});

//
//https://github.com/fastify/fastify-jwt
//
fastify.register(fastifyJwt, {secret: config.server.auth.secret || 'superSecret'});
//fastify.register(pluginAuthenticate, {secret: config.server.auth.secret || 'superSecret'});

fastify.decorateRequest('config', null);
fastify.decorateRequest('log', fastify.log);
fastify.decorateReply('jwt', fastify?.jwt);

fastify.addHook('preHandler', (req: IRequest, res: IResponse, done: HookHandlerDoneFunction) =>
{
    req.config = config;
    res['jwt'] = fastify.jwt;

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
    const {message, statusCode = 400} = error;

    response.code(statusCode).send({
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

loader(pathJoin(__dirname, 'routes'), fastify).then(async () =>
{
    //
    // configuring views engine
    //
    fastify.log.info('Checking for template engine');

    if (config.templating)
    {
        fastify.log.info(`Found ${config.templating.engine} templating engine`);

        try
        {
            const engine = await import(config.templating.engine);

            const {root, layout, ext = 'html', options} = config.templating;

            const getRootPath = () =>
            {
                if (isAbsolute(root))
                {
                    return root;
                }

                return pathJoin(__dirname, root);
            };

            fastify.register(fastifyView, {
                engine: {
                    [config.templating.engine]: engine
                },
                viewExt: ext,
                root: getRootPath(),
                layout,
                options
            });

        }
        catch (e: any)
        {
            fastify.log.error(e.message);
        }
    }

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
});

