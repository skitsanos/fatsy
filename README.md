# Fatsy

> Fastify Server Template done in TypeScript.

## Routing convention

Fatsy is using the same route definition standard as
in [Foxx Builder](https://github.com/skitsanos/foxx-builder), [Umi](https://umijs.org/), [Ice](https://ice.work/), and
many others:

```
/routes
-- get.js
-- /echo
---- get.js
-- /users
---- /$id
------- get.js
---- get.js
---- post.js
```

The `routes` folder should contain all your routes. Each route is a folder with a name that is the same as the route
path. The route path is the path that is used in the browser to access the route. For example, if you have a route
`/users`, then the route path is `/users`. If your route has a parameter, then the route path contains a `$` followed
by the name of the parameter.

Each route folder can contain one or more files. Each file is a route handler. The name of the file is the HTTP method
that the route handler handles. For example, if you have a route handler that handles the `POST` method, then the name
of the file is `post.js`. If you have a route handler that handles the `GET` method, then the name of the file
is `get.js`.

### Support for websockets

In order to support websockets, you need to create a file `ws.js` in the route folder. This file will be used as a
websocket handler.

The following example demonstrates how to create a websocket handler that will use [OpenAI](https://openai.com/) to
answer questions from the user. It is using [Weaviate](https://www.semi.technology/developers/weaviate/current/) as a
vector store for the document retrieval and index. 

```js
import weaviate from 'weaviate-ts-client';
import {WeaviateStore} from 'langchain/vectorstores/weaviate';
import {OpenAIEmbeddings} from 'langchain/embeddings/openai';

const ws: FatsyDynamicRoute = {
    private: false,
    handler: async (connection: SocketStream, _request: FastifyRequest) =>
    {
        const client = weaviate.client({
            scheme: process.env.WEAVIATE_SCHEME || 'http',
            host: process.env.WEAVIATE_HOST || 'localhost'
        });

        const store = await WeaviateStore.fromExistingIndex(new OpenAIEmbeddings(), {
            client,
            indexName: 'Test',
            textKey: 'content',
            metadataKeys: ['productId', 'versionId']
        });

        const chat = new OpenAI({
            streaming: true,
            callbacks: [
                {
                    handleLLMNewToken(token)
                    {
                        connection.socket.send(token);
                    }
                }
            ]
        });

        const chain = ConversationalRetrievalQAChain.fromLLM(
            chat,
            store.asRetriever()
        );

        connection.socket.on('message', async (message: string) =>
        {
            await chain.call({
                question: message.toString(),
                chat_history: []
            });
        });

        connection.socket.on('close', () =>
        {
            console.log('Client disconnected');
        });
    }
};

export default ws;
```

## Config is in YAML format

No more confusing JSON, - simple and readable YAML config

```yaml
app:
  title: My demo API server

server:
  host: "0.0.0.0"
  port: 3000
  logger:
    level: trace
```

### Core features available

- [x] Application routing convention similar to the one we use
  on [Foxx Builder](https://github.com/skitsanos/foxx-builder)
- [x] Application configuration with load order to the `config` npm package, so the first one loads is `default`,
  then `local`,
  then your `NODE_ENV` profile
- [x] Templating engine - by default, there is [Handlebars](https://handlebarsjs.com/) bundled for you
- [x] S3 storage support ([Example](src/routes/api/uploads/s3))
- [x] Websockets support

### Environments that were tested

- [x] Runs in standalone mode
- [x] Runs in Docker
- [x] Runs in Amazon ECS
- [x] Runs in amazon ECS via HashiCorp waypoint

### Useful links

- [Connect Node.js to MinIO with TLS using AWS S3](https://northflank.com/guides/connect-nodejs-to-minio-with-tls-using-aws-s3)