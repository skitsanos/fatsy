import {IDynamicRoute} from '@/utils/loader';

const post: IDynamicRoute = {
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
        const {username, password} = request.body;

        response.send({username});
    }
};

export default post;