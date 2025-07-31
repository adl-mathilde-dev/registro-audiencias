import mysql from 'mysql2/promise';

// Configuración flexible para desarrollo y producción
const createPool = () => {
  // Si estamos en build time específicamente, no intentar conectar
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('🏗️  Build time detectado, omitiendo conexión a base de datos');
    return null;
  }

  // Si existe DATABASE_URL (producción en la nube), la usamos
  if (process.env.DATABASE_URL) {
    console.log('🌐 Conectando a base de datos usando DATABASE_URL...');
    return mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  
  // Configuración individual con validación
  const dbConfig = {
    host: process.env.DB_HOST || '50.63.25.32',
    user: process.env.DB_USER || 'admin_mathilde_gato_verde',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'audiencias_mathilde_db',
    port: parseInt(process.env.DB_PORT || '3306'),
  };

  // Validar configuración crítica
  if (!dbConfig.password && process.env.NODE_ENV === 'production') {
    console.error('❌ ERROR CRÍTICO: DB_PASSWORD no está configurada en producción');
    console.error('📋 Variables de entorno requeridas:');
    console.error('   - DB_HOST');
    console.error('   - DB_USER');
    console.error('   - DB_PASSWORD');
    console.error('   - DB_NAME');
    console.error('   - DB_PORT');
    throw new Error('Configuración de base de datos incompleta en producción');
  }

  // Log detallado para debugging (sin mostrar password)
  console.log('🔗 Configuración de base de datos:');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Usuario: ${dbConfig.user}`);
  console.log(`   Base de datos: ${dbConfig.database}`);
  console.log(`   Puerto: ${dbConfig.port}`);
  console.log(`   Password configurado: ${dbConfig.password ? '✅ Sí' : '❌ No'}`);
  console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Fase: ${process.env.NEXT_PHASE || 'no especificada'}`);
  
  // Verificar si estamos usando valores por defecto en producción
  if (process.env.NODE_ENV === 'production') {
    const usingDefaults = [
      !process.env.DB_HOST && 'DB_HOST',
      !process.env.DB_USER && 'DB_USER', 
      !process.env.DB_PASSWORD && 'DB_PASSWORD',
      !process.env.DB_NAME && 'DB_NAME',
      !process.env.DB_PORT && 'DB_PORT'
    ].filter(Boolean);
    
    if (usingDefaults.length > 0) {
      console.warn(`⚠️  ADVERTENCIA: Usando valores por defecto para: ${usingDefaults.join(', ')}`);
    }
  }

  return mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });
};

let pool: mysql.Pool | null;

try {
  pool = createPool();
  
  // Solo validar conexión si el pool existe
  if (pool) {
    // Validar conexión al inicializar
    pool.execute('SELECT 1 as test')
      .then(() => {
        console.log('✅ Conexión a base de datos establecida correctamente');
      })
      .catch((error) => {
        console.error('❌ Error al conectar con la base de datos:', error.message);
        console.error('🔍 Código de error:', error.code);
        console.error('🔍 SQL State:', error.sqlState);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ER_ACCESS_DENIED_NO_PASSWORD_ERROR') {
          console.error('🚨 ERROR DE AUTENTICACIÓN:');
          console.error('   - Verifica que las variables DB_USER y DB_PASSWORD estén correctas');
          console.error('   - En el servidor, ejecuta: printenv | grep DB_');
        }
      });
  }
} catch (error) {
  console.error('❌ Error crítico al inicializar pool de conexiones:', error);
  pool = null;
}

export default pool; 