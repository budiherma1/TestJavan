FROM node:16.14.0-alpine3.15

RUN npm install knex -g

LABEL maintainer="budiherma1_javantest"

WORKDIR /usr/apps/javan_be

ENV NODE_ENV development

COPY package.json /usr/apps/javan_be/

RUN npm install

CMD ["npm", "run", "dev"]