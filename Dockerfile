    # Etapa 1: build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Usar el script de build específico para Docker
RUN npm run build:docker
# Copiar archivos estáticos al standalone
RUN cp -r .next/static .next/standalone/.next/
# Etapa 2: producción
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
# Agregar variables de entorno para evitar errores durante el build
ENV NEXT_PHASE=phase-production-build
COPY --from=builder /app ./
EXPOSE 3001
# Usar el comando correcto para standalone
CMD ["node", ".next/standalone/server.js"]