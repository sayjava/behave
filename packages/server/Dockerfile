FROM node:12.0.0-alpine as dev

WORKDIR /usr/src/app
COPY package.json ./

RUN yarn
COPY . .
RUN yarn build

ENV NODE_ENV=production

# RUN yarn prune

ENTRYPOINT [ "./lib/bin/index.js" ]
