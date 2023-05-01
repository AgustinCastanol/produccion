FROM node:latest

WORKDIR /app/backend/aph
COPY . .
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]