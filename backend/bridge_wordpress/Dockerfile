FROM node:18.14.2

# Define el directorio de trabajo
WORKDIR /app/backend/bridge_wordpress

# Copia los archivos del directorio actual al contenedor
COPY package*.json ./
RUN npm install
COPY . .


EXPOSE 47300
# Compila la aplicación
CMD [ "node", "index.js" ]
# docker build -t bridge-wp .
# docker run -d -p 47300:47300 bridge-wp