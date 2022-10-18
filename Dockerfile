FROM node:lts-slim as builder

RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y

# set a non privileged user to use when running this image
RUN groupadd -r nodejs && useradd -g nodejs -s /bin/bash -d /home/nodejs -m nodejs
USER nodejs
# set right (secure) folder permissions
RUN mkdir -p /home/nodejs/app/node_modules && chown -R nodejs:nodejs /home/nodejs/app

WORKDIR /home/nodejs/app

# set default node env
ARG NODE_ENV=development
# ARG NODE_ENV=production
# to be able to run tests (for example in CI), do not set production as environment
ENV NODE_ENV=${NODE_ENV}

ENV NPM_CONFIG_LOGLEVEL=warn

# copy project definition/dependencies files, for better reuse of layers
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs ./tsconfig.json ./

# copy all sources in the container (exclusions in .dockerignore file)
COPY --chown=nodejs:nodejs ./src ./src
COPY --chown=nodejs:nodejs ./config ./config

RUN yarn

EXPOSE 3000

CMD [ "yarn", "run","dev"]