import {FastifyReply} from 'fastify';

/**
 * Send a response to the client with the given code and data.
 * @param response {FastifyReply} The response object.
 * @param code {number} The status code.
 * @param data {unknown} The data to send.
 */
const apiResponse = (response: FastifyReply, code: number, data?: unknown) =>
{
    if (code === 200 || code === 201)
    {
        response.code(code).send(data);
        return;
    }

    response.code(code).send({
        error: data
    });
};

export default apiResponse;