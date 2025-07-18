# Imagen base
FROM node:22-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de archivos
COPY . .

# Exponer el puerto de desarrollo
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "dev"]
