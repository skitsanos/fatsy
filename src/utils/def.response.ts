import {FastifyReply} from 'fastify';
import {JWT} from '@fastify/jwt';

export interface IResponse extends FastifyReply
{
    jwt: JWT;
}