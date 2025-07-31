# Registro de Audiencias

Sistema web para el registro y gestión de audiencias desarrollado con Next.js, TypeScript y MySQL.

## Tecnologías

- Next.js 14
- React 18
- TypeScript
- MySQL
- Tailwind CSS
- Axios

## Instalación

### Prerrequisitos
- Node.js 18+
- MySQL 8.0+

### Pasos

1. **Clonar el repositorio**
```bash
git clone <url-del-repo>
cd registro-audiencias
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
```bash
mysql -u root -p < database_schema_fixed.sql
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3001

## Scripts

```bash
npm run dev        # Desarrollo (puerto 3001)
npm run dev:3000   # Desarrollo (puerto 3000)
npm run build      # Construcción
npm run start      # Producción (standalone)
npm run start:next # Producción (next start)
npm run start:3000 # Producción (puerto 3000)
npm run lint       # Linting
```

## Docker

Para ejecutar con Docker:

```bash
# Construir y ejecutar
docker-compose up --build

# Solo ejecutar
docker-compose up

# Ejecutar en segundo plano
docker-compose up -d
```

La aplicación estará disponible en: http://localhost:3001

## Estructura

```
src/
├── app/          # Páginas y API routes
├── components/   # Componentes React
├── lib/         # Utilidades
└── types/       # Tipos TypeScript
```

## Base de Datos

Configuración por defecto:
- Host: localhost
- Usuario: root
- Password: root!
- Base de datos: audiencias

## Puertos

- **Desarrollo**: Puerto 3001 (configurado por defecto)
- **Producción**: Puerto 3001
- **Docker**: Puerto 3001

Si necesitas usar el puerto 3000, puedes usar los comandos `npm run dev:3000` o `npm run start:3000`.

## Producción

Para ejecutar en producción:

```bash
# Construir la aplicación
npm run build

# Ejecutar en modo standalone (recomendado)
npm run start

# O usar next start (alternativo)
npm run start:next
```

## Hosting y Deployment

### Variables de Entorno Requeridas

Para que la aplicación funcione en producción, necesitas configurar estas variables de entorno:

```bash
# Configuración del servidor
NODE_ENV=production
PORT=3001
HOSTNAME=0.0.0.0

# Configuración de base de datos
DB_HOST=31.97.103.77
DB_USER=gato_azul_admin
DB_PASSWORD=TU_PASSWORD_AQUI
DB_NAME=audiencias_mathilde_db
DB_PORT=3308
```

### Troubleshooting

Si obtienes el error "Servicio de autenticación no disponible":

1. **Verificar variables de entorno:**
```bash
# En el servidor, ejecuta:
./scripts/check-env.sh
```

2. **Verificar logs del container:**
```bash
docker logs registro-audiencias
```

3. **Verificar conectividad a la base de datos:**
```bash
# Desde el servidor, prueba:
mysql -h 31.97.103.77 -P 3308 -u gato_azul_admin -p audiencias_mathilde_db
```

4. **Verificar firewall:**
```bash
# Asegúrate de que el puerto 3308 esté abierto
telnet 31.97.103.77 3308
```

### Configuración en Docker Compose

Para usar variables de entorno en Docker Compose:

```yaml
services:
  web:
    environment:
      DB_PASSWORD: ${DB_PASSWORD}
```

Y crear un archivo `.env` en el servidor con:
```bash
DB_PASSWORD=tu_password_real_aqui
```

## Problemas Conocidos

Si tienes problemas con la instalación de dependencias, consulta `INSTALL_INSTRUCTIONS.md`. 