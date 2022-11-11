import {existsSync, readdirSync, statSync} from 'fs';
import {basename, join as pathJoin, sep as pathSeparator, posix} from 'path';
import {FastifyInstance, FastifySchema, HTTPMethods, RouteHandlerMethod} from 'fastify';

export interface ILoadableHandler
{
    schema?: FastifySchema,
    handler: RouteHandlerMethod,
}

interface IRouteHandler
{
    handler: RouteHandlerMethod,
    schema?: FastifySchema,
    url: string
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
                    parsePath(root, fullPath, fastify);
                }

                if (statSync(fullPath).isFile())
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

                    fastify.route({
                        method: method.toUpperCase() as HTTPMethods,
                        handler: routeModule.default.handler,
                        schema: routeModule.default.schema,
                        url: pathParsed
                    });
                }
            }
        }
    }
};

const loader = async (path: string, fastify: FastifyInstance) =>
{
    const posixPath = path.split(pathSeparator).join(posix.sep);
    const routesRoot = posixPath.split('/').pop() as string;
    await parsePath(routesRoot, path, fastify);
};

export default loader;