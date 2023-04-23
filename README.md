# Fatsy

>  Fastify Server Template done in TypeScript.

Fatsy is using the same route definition standard as in [Foxx Builder](https://github.com/skitsanos/foxx-builder), [Umi](https://umijs.org/), [Ice](https://ice.work/), and many others:

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

### Config is in YAML format

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

- [x] Application routing convention similar to the one we use on [Foxx Builder](https://github.com/skitsanos/foxx-builder)
- [x] Application configuration with load order to the `config` npm package, so the first one loads is `default`, then `local`,
  then your `NODE_ENV` profile
- [x] Templating engine - by default, there is [Handlebars](https://handlebarsjs.com/) bundled for you
- [x] S3 storage support ([Example](src/routes/api/uploads/s3))
- [x] Websockets support

### Environments that were tested

- [x] Runs in standalone mode
- [x] Runs in Docker
- [x] Runs in Amazon ECS
- [x] Runs in amazon ECS via HashiCorp waypoint