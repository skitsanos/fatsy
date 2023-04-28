import {existsSync, readdirSync, statSync} from 'fs';
import {basename, dirname, join as pathJoin, posix, resolve, sep as pathSeparator} from 'path';
import {DoneFuncWithErrOrRes, FastifyInstance, FastifyReply, FastifyRequest, FastifySchema, HTTPMethods} from 'fastify';
import {readJsonSync} from 'fs-extra';
import ApplicationConfiguration from '@skitsanos/app-config';
import Configuration from '@/app/Configuration';
import fastifyWebSocket, {SocketStream} from '@fastify/websocket';

export interface FatsyRouteUtils
{
    log: FastifyInstance['log'];
    config: ApplicationConfiguration;
    jwt: FastifyInstance['jwt'];
}

export interface FatsyDynamicRoute
{
    private?: boolean,
    schema?: FastifySchema,
    handler:
        ((request: FastifyRequest, response: FastifyReply, utils: FatsyRouteUtils) => void)
        | ((connection: SocketStream, request: FastifyRequest, utils: FatsyRouteUtils) => void)
    onRequest?: (request: FastifyRequest, response: FastifyReply, done: DoneFuncWithErrOrRes) => void,
}

const parsePath = async (root: string, p: string, fastify: FastifyInstance) =>
{
    if (existsSync(p))
    {
        const fsItems = readdirSync(p);
        if (fsItems.length > 0)
        {
            for (const item of fsItems)
            {
                const fullPath = pathJoin(p, item);
                if (statSync(fullPath).isDirectory())
                {
                    await parsePath(root, fullPath, fastify);
                }

                if (statSync(fullPath).isFile() && fullPath.match(/\.[tj]s$/igu))
                {
                    const posixPath = fullPath.split(pathSeparator).join(posix.sep);
                    const urlPath = posixPath.substring(posixPath.indexOf('routes') + 6)
                    .replace(`/${root}`, '')
                    .replace(/\/\w+\.(.+)$/gi, '');

                    const pathParsed = urlPath === ''
                        ? '/'
                        : urlPath.replace(/\$/gi, ':');

                    const method = basename(fullPath).replace(/\.[^/.]+$/, '');

                    fastify.log.info(`Mounting ${method.toUpperCase()} ${pathParsed}`);

                    const importedModule = await import(fullPath);

                    const routeModule = importedModule.default.default ? importedModule.default : importedModule;

                    const jwtVerifyHandler = async (request: FastifyRequest, response: FastifyReply) =>
                    {
                        try
                        {
                            await request.jwtVerify();
                        }
                        catch (err)
                        {
                            response.send(err);
                        }
                    };

                    const requestSchema = (): FastifySchema | undefined =>
                    {
                        if (routeModule.default.schema)
                        {
                            return routeModule.default.schema;
                        }

                        const pathToSchema = pathJoin(dirname(fullPath), `${method.toLowerCase()}.schema.json`);
                        if (existsSync(pathToSchema))
                        {
                            fastify.log.info(`Found externally defined schema for ${pathParsed}`);

                            return {
                                ...readJsonSync(pathToSchema).properties
                            };
                        }

                        return undefined;
                    };

                    //
                    // Support for websocket routes
                    //
                    if (method.toLowerCase() === 'websockets' || method.toLowerCase() === 'ws')
                    {
                        fastify.register(async function (f)
                        {
                            f.get(pathParsed, {
                                websocket: true,
                                ...routeModule.default.private ? {onRequest: jwtVerifyHandler} : {onRequest: routeModule.default.onRequest},
                            }, async (connection: SocketStream, request: FastifyRequest) =>
                                routeModule.default.handler(connection, request, {
                                    log: fastify.log,
                                    jwt: fastify.jwt,
                                    config: Configuration.getInstance()
                                }));
                        });
                        return;
                    }

                    fastify.route({
                        method: method.toUpperCase() as HTTPMethods,
                        handler: (request, response) => routeModule.default.handler(request, response, {
                            log: fastify.log,
                            jwt: fastify.jwt,
                            config: Configuration.getInstance()
                        }),
                        schema: requestSchema(),
                        ...routeModule.default.private ? {onRequest: jwtVerifyHandler} : {onRequest: routeModule.default.onRequest},
                        url: pathParsed
                    });
                }
            }
        }
    }
};

const loader = async (path: string, fastify: any) =>
{
    fastify.register(fastifyWebSocket);

    const posixPath = path.split(pathSeparator).join(posix.sep);
    const routesRoot = resolve(posixPath);

    if (existsSync(routesRoot))
    {
        await parsePath(routesRoot, path, fastify);
    }
};

export default loader;