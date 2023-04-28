/**
 * Fatsy - Fastify Server Template done in TypeScript
 * @version 1.3.0
 * @author skitsanos, https://github.com/skitsanos
 */
import Fastify from 'fastify';
import {isAbsolute, join as pathJoin} from 'path';
import fileUpload from 'fastify-file-upload';
import fastifyView from '@fastify/view';
import loader from '@/utils/loader';
import pluginAuthenticate from '@/plugins/auth';
import {ensureDirSync, readFileSync} from 'fs-extra';
import staticFilesPlugin from '@fastify/static';
import getLogsLocation from '@/utils/getLogsLocation';
import Configuration from '@/app/Configuration';
import {existsSync} from 'fs';

import AppEvents, {ApplicationEvent, EventTypes} from '@/app/AppEvents';

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
if (config['server'].static)
{
    const pathStaticFiles = isAbsolute(config['server'].static) ? config['server'].static : pathJoin(__dirname, '..', config['server'].static);
    fastify.log.info(`Mounting static resources from ${pathStaticFiles}`);

    if (!existsSync(pathStaticFiles))
    {
        fastify.log.error(`Static resources folder ${pathStaticFiles} does not exist`);
        process.exit(1);
    }

    fastify.register(staticFilesPlugin, {
        root: pathStaticFiles,
        //prefix: '/',
        wildcard: true
    });

}

//
//https://github.com/fastify/fastify-jwt
//
//fastify.register(fastifyJwt, {secret: config.server.auth.secret || 'superSecret'});
fastify.register(pluginAuthenticate, {secret: config['server'].auth.secret || 'superSecret'});

fastify.register(fileUpload);

fastify.addHook('onRequest', async (req, res) =>
{
    res.header('server', config['app']?.title);
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

    AppEvents.getInstance().emit(ApplicationEvent.LOG, {
        type: EventTypes.DEBUG,
        url: req.url
    });
});

fastify.setErrorHandler((error, _, response) =>
{
    const {
        message,
        statusCode = 400
    } = error;

    response.code(statusCode).send({
        error: {
            message
        },
        ...process.env['NODE_ENV'] !== 'production' && {
            debug: {
                error
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

            const {
                root,
                layout,
                ext = 'html',
                options
            } = config['templating'];

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