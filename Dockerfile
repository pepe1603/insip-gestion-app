#frontend/Dockerfile

# --- STAGE 1: Construcción de la aplicación Frontend ---
FROM node:20 AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo de configuración de paquetes
COPY package*.json ./

# Instala las dependencias del frontend
RUN npm install

# Copia el archivo .env específico del frontend.
# Es crucial que esté aquí para que Vite lo lea durante la construcción.
COPY .env ./

# Si quieres que VITE_API_URL sea dinámica y se defina en tiempo de construcción del Dockerfile
# puedes usar un ARG y sustituirlo en el .env antes de la construcción.
# Esto es útil si la IP del host cambia o la quieres definir en docker-compose.
ARG HOST_API_URL

# Usa 'sed' para reemplazar la URL de la API en el archivo .env
# Esto permitirá que Docker Compose inyecte la IP del host aquí.
# Solo ejecuta esto si HOST_API_URL fue proporcionada.
# El 'g' al final es para reemplazar todas las ocurrencias en la línea.

# *** PASO DE DEPURACIÓN CRÍTICO: Añadir un cat para ver el contenido del .env después del sed ***
RUN if [ -n "${HOST_API_URL}" ]; then \
    echo "DEBUG: HOST_API_URL is set to ${HOST_API_URL}"; \
    sed -i "s|^VITE_API_URL=.*|VITE_API_URL=${HOST_API_URL}|g" .env; \
    echo "DEBUG: Content of .env after sed:"; \
    cat .env; \
    fi

# Copia el resto del código fuente del frontend
COPY . .

# Construye la aplicación frontend para producción con Vite
# Vite leerá el archivo .env que acabamos de manipular en /app
RUN npm run build

# --- STAGE 2: Servir la aplicación ---
# Usa una imagen base de Nginx ligera para servir los archivos estáticos.
FROM nginx:alpine

# Copia los archivos estáticos generados en la etapa de construcción al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia tu configuración personalizada de Nginx
COPY docker/nginx/frontend.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80 para el servidor web
EXPOSE 80

# El comando por defecto para Nginx
CMD ["nginx", "-g", "daemon off;"]