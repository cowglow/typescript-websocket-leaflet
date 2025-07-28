FROM node:24.2

WORKDIR /app
COPY package*.json ./
RUN npm install --force && npm cache clean --force
COPY . .
