FROM node:12.0.0-alpine as dev

WORKDIR /usr/src/app
COPY package.json ./

RUN yarn
COPY . .

RUN npm install -g typescript
RUN yarn build

ENV NODE_ENV=production

ENTRYPOINT [ "./lib/bin/index.js" ]
