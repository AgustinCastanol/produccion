FROM node:12.10-slim

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

EXPOSE 8876
EXPOSE 8877

CMD ["npm", "run", "start:prod"]