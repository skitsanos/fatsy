import {FatsyDynamicRoute} from '@/utils/loader';

const post: FatsyDynamicRoute = {
    schema: {
        body: {
            type: 'object',
            properties: {
                username: {type: 'string'},
                password: {type: 'string'}
            },
            required: ['username', 'password']
        }
    },
    handler: (request, response) =>
    {
        const {
            username
        } = request.body as Record<string, string>;

        response.send({username});
    }
};

export default post;