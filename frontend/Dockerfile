# Define la imagen base
FROM node:latest

# Define el directorio de trabajo
WORKDIR /app

# Copia los archivos del directorio actual al contenedor
COPY package*.json ./
RUN npm install
COPY . .

# Compila la aplicación
RUN npm run build

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 8080
EXPOSE 5173

# Ejecuta el servidor de la aplicación
CMD [ "npm", "run", "start" ]