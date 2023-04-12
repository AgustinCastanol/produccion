FROM node:latest

WORKDIR /app/backend/login
COPY package*.json ./
RUN npm install
COPY . .


CMD ["npm", "run", "start:prod"]