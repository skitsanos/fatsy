import fp from 'fastify-plugin';
import fastifyWebSocket, {SocketStream} from '@fastify/websocket';
import {FastifyPluginOptions, FastifyRequest} from 'fastify';
import {on} from 'events';
import AppEvents, {ApplicationEvent} from '@/app/AppEvents';

const websocketPlugin = fp(async (fastify, opts: FastifyPluginOptions) =>
{
    const {
        eventName = ApplicationEvent.LOG,
        endpoint = '/notifications'
    } = opts;

    fastify.register(fastifyWebSocket);

    fastify.register(async function (fastify)
    {
        fastify.get(endpoint, {websocket: true}, async (connection: SocketStream /* SocketStream */, _req: FastifyRequest /* FastifyRequest */) =>
        {
            connection.socket.on('message', (msg: string) =>
            {
                console.log(msg);
                connection.socket.send('{}');
            });

            for await (const [event] of on(AppEvents.getInstance(), eventName))
            {
                connection.socket.send(JSON.stringify(event));
            }
        });
    });
});

export default websocketPlugin;