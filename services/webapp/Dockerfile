ARG NODE_IMAGE=node:20-alpine

FROM node:20-alpine

WORKDIR /app
#COPY package*.json ./
#RUN npm install --force && npm cache clean --force
COPY . .
CMD ["npm","run", "dev"]
