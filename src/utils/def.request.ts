import {FastifyRequest} from 'fastify';
import {IDefConfig} from '@/utils/def.config';

export interface IRequest extends FastifyRequest
{
    config?: IDefConfig;

    [key: string]: any;
}