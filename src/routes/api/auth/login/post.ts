import {IDynamicRoute} from '@/utils/loader';
import {IResponse} from '@/utils/def.response';
import {IRequest} from '@/utils/def.request';

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

    handler: (request: IRequest, response: IResponse) =>
    {
        const {username, password} = request.body as Record<string, string>;

        const {jwt} = response;

        response.send({
            result: {
                token: jwt.sign({username})
            }
        });
    }
};

export default post;