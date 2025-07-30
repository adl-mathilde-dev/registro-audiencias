# Instrucciones de Instalación - Problema AWS CodeArtifact

## Problema Identificado

Tu npm está configurado para usar AWS CodeArtifact, por eso aparece el error de autenticación al intentar instalar paquetes públicos.

## Soluciones

### Opción 1: Cambiar registro temporalmente (Recomendado)

```bash
# 1. Guardar configuración actual
npm config get registry

# 2. Cambiar a registro público
npm config set registry https://registry.npmjs.org/

# 3. Instalar dependencias
npm install

# 4. Restaurar tu configuración de CodeArtifact
npm config set registry <tu-url-de-codeartifact>
```

### Opción 2: Usar archivo .npmrc local

```bash
# 1. Crear .npmrc local
echo "registry=https://registry.npmjs.org/" > .npmrc

# 2. Instalar dependencias
npm install

# 3. Eliminar .npmrc (opcional)
rm .npmrc
```

### Opción 3: Instalar con registry específico

```bash
npm install --registry https://registry.npmjs.org/
```

## Después de Instalar

1. **Verificar base de datos**: Asegúrate que MySQL esté corriendo con:
   - Host: localhost
   - Usuario: root  
   - Password: root!
   - Base de datos: audiencias

2. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

3. **Abrir en navegador**: http://localhost:3000

## Variables de Entorno (Opcional)

Puedes crear un archivo `.env.local` para personalizar la conexión de base de datos:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root!
DB_NAME=audiencias
```

## Verificar que Funciona

La aplicación debería:
- ✅ Mostrar el formulario de registro
- ✅ Conectar a la base de datos MySQL
- ✅ Permitir crear registros
- ✅ Mostrar tabla de audiencias
- ✅ Permitir actualizar estados (Dev/QA/Prod)

## Migración Completada

Has migrado exitosamente:
- **Backend Express** → **Next.js API Routes**  
- **Frontend React/Vite** → **Next.js con SSR**
- **Proyectos separados** → **Un solo proyecto unificado**

¡Todo en un solo lugar con SSR y client-side rendering! 