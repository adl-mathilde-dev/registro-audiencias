import pool from './database';
import { Usuario } from '../types/auth';
import { getBogotaDateForMySQL } from './dateUtils';

interface LogEntry {
  accion: 'INSERT' | 'UPDATE' | 'DELETE';
  estado: 'ANTES' | 'DESPUES';
  id_global?: number;
  id_unico?: string;
  cliente?: string;
  nombre?: string;
  fecha?: string;
  dev?: string;
  qa?: string;
  prod?: string;
  detalles?: string;
  usuario_id?: number;
  usuario_nombre?: string;
  usuario_email?: string;
}

export const logService = {
  async insertLog(logData: LogEntry): Promise<void> {
    try {
      const fechaCambio = getBogotaDateForMySQL();
      
      console.log(`📝 Insertando log:`, {
        accion: logData.accion,
        estado: logData.estado,
        id_global: logData.id_global,
        usuario: logData.usuario_nombre || 'Sin usuario',
        fecha_cambio: fechaCambio
      });
      
      const query = `INSERT INTO log_data_audiencias (
        accion, estado, id_global, id_unico, cliente, nombre, 
        fecha, dev, qa, prod, detalles, usuario_id, usuario_nombre, usuario_email, fecha_cambio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      const values = [
        logData.accion,
        logData.estado,
        logData.id_global || null,
        logData.id_unico || null,
        logData.cliente || null,
        logData.nombre || null,
        logData.fecha || null,
        logData.dev || null,
        logData.qa || null,
        logData.prod || null,
        logData.detalles || null,
        logData.usuario_id || null,
        logData.usuario_nombre || null,
        logData.usuario_email || null,
        fechaCambio
      ];
      
      console.log(`🔄 Ejecutando query de log:`, query);
      console.log(`📊 Valores del log:`, values);
      
      const [result] = await pool.execute(query, values);
      
      console.log(`✅ Log insertado correctamente:`, result);
      
      // Verificar que el log se insertó
      if (result && typeof result === 'object' && 'insertId' in result) {
        const insertResult = result as { insertId: number };
        console.log(`🔍 Log insertado con ID: ${insertResult.insertId}`);
      }
      
    } catch (error) {
      console.error('❌ ERROR CRÍTICO al insertar log:', error);
      console.error('📋 Datos del log que falló:', logData);
      
      // Si es un error de MySQL, mostrar más detalles
      if (error instanceof Error && 'code' in error) {
        const mysqlError = error as any;
        console.error(`🔍 Código de error MySQL: ${mysqlError.code}`);
        console.error(`🔍 SQL State: ${mysqlError.sqlState}`);
        console.error(`🔍 Mensaje SQL: ${mysqlError.sqlMessage}`);
      }
      
      // Re-lanzar el error para que se capture en el nivel superior
      throw error;
    }
  },

  async logInsert(registro: any, usuario?: Usuario): Promise<void> {
    console.log(`📝 Generando log de INSERT para registro ${registro.id_global}`);
    
    try {
      await this.insertLog({
        accion: 'INSERT',
        estado: 'DESPUES',
        id_global: registro.id_global,
        id_unico: registro.id_unico,
        cliente: registro.cliente,
        nombre: registro.nombre,
        fecha: registro.fecha,
        dev: registro.dev,
        qa: registro.qa,
        prod: registro.prod,
        detalles: registro.detalles,
        usuario_id: usuario?.id,
        usuario_nombre: usuario?.nombre,
        usuario_email: usuario?.email
      });
      console.log(`✅ Log de INSERT completado para registro ${registro.id_global}`);
    } catch (error) {
      console.error(`❌ Error en logInsert para registro ${registro.id_global}:`, error);
      throw error;
    }
  },

  async logUpdate(registroAntes: any, registroDespues: any, usuario?: Usuario): Promise<void> {
    console.log(`📝 Generando logs de UPDATE para registro ${registroAntes.id_global}`);
    console.log(`🔄 Cambios detectados:`, {
      antes: { dev: registroAntes.dev, qa: registroAntes.qa, prod: registroAntes.prod },
      despues: { dev: registroDespues.dev, qa: registroDespues.qa, prod: registroDespues.prod }
    });
    
    try {
      // Log del estado ANTES
      console.log(`📝 Insertando log ANTES...`);
      await this.insertLog({
        accion: 'UPDATE',
        estado: 'ANTES',
        id_global: registroAntes.id_global,
        id_unico: registroAntes.id_unico,
        cliente: registroAntes.cliente,
        nombre: registroAntes.nombre,
        fecha: registroAntes.fecha,
        dev: registroAntes.dev,
        qa: registroAntes.qa,
        prod: registroAntes.prod,
        detalles: registroAntes.detalles,
        usuario_id: usuario?.id,
        usuario_nombre: usuario?.nombre,
        usuario_email: usuario?.email
      });

      // Log del estado DESPUÉS
      console.log(`📝 Insertando log DESPUÉS...`);
      await this.insertLog({
        accion: 'UPDATE',
        estado: 'DESPUES',
        id_global: registroDespues.id_global,
        id_unico: registroDespues.id_unico,
        cliente: registroDespues.cliente,
        nombre: registroDespues.nombre,
        fecha: registroDespues.fecha,
        dev: registroDespues.dev,
        qa: registroDespues.qa,
        prod: registroDespues.prod,
        detalles: registroDespues.detalles,
        usuario_id: usuario?.id,
        usuario_nombre: usuario?.nombre,
        usuario_email: usuario?.email
      });
      
      console.log(`✅ Logs de UPDATE completados para registro ${registroAntes.id_global}`);
    } catch (error) {
      console.error(`❌ Error en logUpdate para registro ${registroAntes.id_global}:`, error);
      throw error;
    }
  },

  async logDelete(registro: any, usuario?: Usuario): Promise<void> {
    console.log(`📝 Generando log de DELETE para registro ${registro.id_global}`);
    
    try {
      await this.insertLog({
        accion: 'DELETE',
        estado: 'ANTES',
        id_global: registro.id_global,
        id_unico: registro.id_unico,
        cliente: registro.cliente,
        nombre: registro.nombre,
        fecha: registro.fecha,
        dev: registro.dev,
        qa: registro.qa,
        prod: registro.prod,
        detalles: registro.detalles,
        usuario_id: usuario?.id,
        usuario_nombre: usuario?.nombre,
        usuario_email: usuario?.email
      });
      console.log(`✅ Log de DELETE completado para registro ${registro.id_global}`);
    } catch (error) {
      console.error(`❌ Error en logDelete para registro ${registro.id_global}:`, error);
      throw error;
    }
  },
  
  // Función de utilidad para verificar logs
  async getRecentLogs(limit: number = 10): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM log_data_audiencias ORDER BY fecha_cambio DESC LIMIT ?',
        [limit]
      );
      return rows as any[];
    } catch (error) {
      console.error('Error al obtener logs recientes:', error);
      return [];
    }
  }
}; 