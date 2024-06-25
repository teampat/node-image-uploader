FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json config.yml server.js ./

RUN npm install --only=production

EXPOSE 3000
CMD [ "node", "server.js" ]