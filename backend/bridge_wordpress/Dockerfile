FROM node:12.18.3-alpine3.9

# Define el directorio de trabajo
WORKDIR /app/backend/bridge_wordpress

# Copia los archivos del directorio actual al contenedor
COPY package*.json ./
RUN npm install
COPY . .


EXPOSE 47300
# Compila la aplicación
CMD [ "node", "index.js" ]
