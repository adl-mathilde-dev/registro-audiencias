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

La aplicación estará disponible en: http://localhost:3000

## Scripts

```bash
npm run dev    # Desarrollo
npm run build  # Construcción
npm run start  # Producción
npm run lint   # Linting
```

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

## Problemas Conocidos

Si tienes problemas con la instalación de dependencias, consulta `INSTALL_INSTRUCTIONS.md`. 