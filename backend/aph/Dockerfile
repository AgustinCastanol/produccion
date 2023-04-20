FROM node:latest

WORKDIR /app/backend/aph
COPY . .
RUN npm install
RUN npm run build


CMD ["npm", "run", "start:prod"]