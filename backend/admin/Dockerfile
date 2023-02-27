FROM node:latest

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3001
EXPOSE 3000

CMD ["npm", "run", "start:prod"]