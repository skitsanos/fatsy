/**
 * Fatsy - Fastify Server Template done in TypeScript
 * @version 1.1.20230103
 * @author skitsanos, https://github.com/skitsanos
 */
import Fastify from 'fastify';
import {isAbsolute, join as pathJoin} from 'path';
import fileUpload from 'fastify-file-upload';
import fastifyView from '@fastify/view';
import loader from '@/utils/loader';
import pluginAuthenticate from '@/plugins/auth';
import {JWT} from '@fastify/jwt';
import {ensureDirSync, readFileSync} from 'fs-extra';
import staticFilesPlugin from '@fastify/static';
import getLogsLocation from '@/utils/getLogsLocation';
import Configuration from '@/app/Configuration';

declare module 'fastify'
{
    interface FastifyRequest
    {
        config: Record<string, any>;
    }

    interface FastifyReply
    {
        jwt: JWT;
        config: Record<string, any>;
    }
}

Configuration.getInstance().load(pathJoin(__dirname, '..', 'config'));

const {config} = Configuration.getInstance();

if (config['server'].logger)
{
    const pathToLogs = getLogsLocation();

    if (pathToLogs)
    {
        ensureDirSync(pathToLogs);
    }
}

const fastify = Fastify({
    logger: {
        ...config['server'].logger
    },

    ...config['server'].https && {
        https: {
            key: readFileSync(config['server'].https.key),
            cert: readFileSync(config['server'].https.cert)
        }
    }
});

//
// support for serving static files
//
const pathStaticFiles = pathJoin(__dirname, '../public/ui/');
fastify.log.info(`Mounting static resources from ${pathStaticFiles}`);

fastify.register(staticFilesPlugin, {
    root: pathStaticFiles,
    //prefix: '/',
    wildcard: true
});

//
//https://github.com/fastify/fastify-jwt
//
//fastify.register(fastifyJwt, {secret: config.server.auth.secret || 'superSecret'});
fastify.register(pluginAuthenticate, {secret: config['server'].auth.secret || 'superSecret'});

fastify.decorateRequest('config', config);
fastify.decorateRequest('log', fastify.log);
fastify.decorateReply('jwt', fastify?.jwt);

fastify.addHook('preHandler', (_req, res, done) =>
{
    res.jwt = fastify.jwt;
    done();
});

fastify.register(fileUpload);

fastify.addHook('onRequest', (_req, res, done) =>
{
    res.header('server', config['app']?.title);
    /*
	 * Helps prevent browsers from trying to guess (???sniff???) the MIME type, which can have security implications.
	 */
    res.header('X-Content-Type-Options', 'nosniff');
    /*
	 * The X-DNS-Prefetch-Control header tells browsers whether they should do DNS prefetching. Turning it on may
	 * not work???not all browsers support it in all situations???but turning it off should disable it on all
     * supported browsers.
	 */
    res.header('X-DNS-Prefetch-Control', 'off');
    /*
	 * The X-Frame-Options header tells browsers to prevent your webpage from being put in an iframe. When
	 * browsers load iframes, they???ll check the value of the X-Frame-Options header and abort loading
	 * if it???s not allowed
	 */
    res.header('X-Frame-Options', 'DENY');

    done();
});

fastify.setErrorHandler((error, _, response) =>
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

    if (config['templating'])
    {
        fastify.log.info(`Found ${config['templating'].engine} templating engine`);

        try
        {
            const engine = await import(config['templating'].engine);

            const {root, layout, ext = 'html', options} = config['templating'];

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
                    [config['templating'].engine]: engine
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
        port: config['server'].port || '0.0.0.0',
        host: config['server'].host || 3000
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

