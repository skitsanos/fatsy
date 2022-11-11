import {FastifyReply} from 'fastify';

export interface IResponse extends FastifyReply
{
    render: <T>(view: string, data: T) => {};
}