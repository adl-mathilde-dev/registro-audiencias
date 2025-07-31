# Etapa 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Usar el script de build específico para Docker
RUN npm run build:docker

# Copiar archivos estáticos al standalone
RUN cp -r .next/static .next/standalone/.next/

# Etapa 2: producción
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app ./

# ⚠️ Forzar que Next escuche en 0.0.0.0, no en la IP interna del contenedor
RUN sed -i 's/const hostname = .*;/const hostname = "0.0.0.0";/' .next/standalone/server.js

EXPOSE 3001

# Ejecutar la app standalone
CMD ["node", ".next/standalone/server.js"]
