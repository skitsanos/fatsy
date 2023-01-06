import {existsSync, readdirSync, statSync} from 'fs';
import {basename, dirname, join as pathJoin, posix, resolve, sep as pathSeparator} from 'path';
import {DoneFuncWithErrOrRes, FastifyInstance, FastifyReply, FastifyRequest, FastifySchema, HTTPMethods} from 'fastify';
import {readJsonSync} from 'fs-extra';

export interface IDynamicRoute
{
    private?: boolean,
    schema?: FastifySchema,
    handler: (request: FastifyRequest, response: FastifyReply, done?: DoneFuncWithErrOrRes) => void,
    onRequest?: (request: FastifyRequest, response: FastifyReply, done: DoneFuncWithErrOrRes) => void,
}

interface IRouteHandler extends IDynamicRoute
{
    private: boolean;
    url: string;
}

interface IRoute
{
    default: IRouteHandler;
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

                    const routeModule: IRoute = await import(posixPath);

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

                    fastify.route({
                        method: method.toUpperCase() as HTTPMethods,
                        handler: routeModule.default.handler,
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
    const posixPath = path.split(pathSeparator).join(posix.sep);
    const routesRoot = resolve(posixPath);

    if (existsSync(routesRoot))
    {
        await parsePath(routesRoot, path, fastify);
    }
};

export default loader;