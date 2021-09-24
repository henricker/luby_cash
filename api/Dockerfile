FROM node:14
RUN mkdir -p /usr/app/api/node_modules
WORKDIR /usr/app/api
RUN chown -R node:node /usr/app/api
COPY . .
USER node
RUN npm i