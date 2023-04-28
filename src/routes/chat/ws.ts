import {FatsyDynamicRoute} from '@/utils/loader';
import {FastifyRequest} from 'fastify';
import {SocketStream} from '@fastify/websocket';

const ws: FatsyDynamicRoute = {
    private: false,
    handler: async (connection: SocketStream, _request: FastifyRequest) =>
    {
        connection.socket.on('message', async (message: string) =>
        {
            //just send the message back to the client
            connection.socket.send(message);
        });

        connection.socket.on('close', () =>
        {
            console.log('Client disconnected');
        });
    }
};

export default ws;