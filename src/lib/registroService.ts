import pool from './database';
import { Registro, CreateRegistroResponse } from '../types/registro';
import { Usuario } from '../types/auth';
import { logService } from './logService';
import { getBogotaDateForMySQL } from './dateUtils';

export const registroService = {
  async getAll(): Promise<Registro[]> {
    if (!pool) {
      throw new Error('Servicio de registros no disponible');
    }
    const [rows] = await pool.execute('SELECT * FROM data_audiencias ORDER BY fecha DESC');
    return rows as Registro[];
  },

  async getById(id: number): Promise<Registro | null> {
    if (!pool) {
      throw new Error('Servicio de registros no disponible');
    }
    const [rows] = await pool.execute('SELECT * FROM data_audiencias WHERE id_global = ?', [id]);
    const results = rows as Registro[];
    return results.length > 0 ? results[0] : null;
  },

  async insertRegistro(data: Omit<Registro, 'id_global' | 'id_unico' | 'fecha'>, usuario?: Usuario): Promise<CreateRegistroResponse> {
    if (!pool) {
      throw new Error('Servicio de registros no disponible');
    }

    const { cliente, nombre, dev, qa, prod, detalles } = data;
    
    if (!cliente || !nombre) {
      throw new Error('Cliente y nombre son obligatorios.');
    }

    // Obtener el último ID único para el cliente
    const [rows] = await pool.execute(
      'SELECT ultimo_id FROM cliente_id_tracker WHERE cliente = ?',
      [cliente]
    );
    
    let nuevoIdUnico = 250000;
    const trackerRows = rows as { ultimo_id: number }[];
    
    if (trackerRows.length > 0) {
      nuevoIdUnico = trackerRows[0].ultimo_id + 1;
      await pool.execute(
        'UPDATE cliente_id_tracker SET ultimo_id = ? WHERE cliente = ?',
        [nuevoIdUnico, cliente]
      );
    } else {
      await pool.execute(
        'INSERT INTO cliente_id_tracker (cliente, ultimo_id) VALUES (?, ?)',
        [cliente, nuevoIdUnico]
      );
    }

    // Insertar el nuevo registro
    const [result] = await pool.execute(
      'INSERT INTO data_audiencias (id_unico, cliente, nombre, dev, qa, prod, detalles) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nuevoIdUnico.toString(), cliente, nombre, dev, qa, prod, detalles]
    );

    const insertResult = result as { insertId: number };
    
    // Log del INSERT
    const nuevoRegistro = {
      id_global: insertResult.insertId,
      id_unico: nuevoIdUnico.toString(),
      cliente,
      nombre,
      fecha: getBogotaDateForMySQL(),
      dev,
      qa,
      prod,
      detalles
    };
    await logService.logInsert(nuevoRegistro, usuario);
    
    return {
      id_global: insertResult.insertId,
      id_unico: nuevoIdUnico.toString(),
      message: 'Registro insertado exitosamente'
    };
  },

  async updateRegistro(id: number, data: Partial<Registro>, usuario?: Usuario): Promise<void> {
    if (!pool) {
      throw new Error('Servicio de registros no disponible');
    }

    console.log(`📝 Iniciando actualización del registro ${id}:`, data);
    console.log(`👤 Usuario que actualiza:`, usuario ? `${usuario.nombre} (${usuario.email})` : 'Sin usuario');
    
    // Obtener el registro ANTES del update para el log
    const registroAntes = await this.getById(id);
    if (!registroAntes) {
      throw new Error(`Registro con ID ${id} no encontrado`);
    }
    
    console.log(`📋 Estado ANTES del update:`, registroAntes);
    
    // Extraer solo los campos que se pueden actualizar
    const { dev, qa, prod, detalles } = data;
    const fechaBogota = getBogotaDateForMySQL();
    
    // Construir dinámicamente la query solo con los campos que tienen valores
    const fieldsToUpdate = [];
    const values = [];
    
    if (dev !== undefined) {
      fieldsToUpdate.push('dev = ?');
      values.push(dev);
    }
    if (qa !== undefined) {
      fieldsToUpdate.push('qa = ?');
      values.push(qa);
    }
    if (prod !== undefined) {
      fieldsToUpdate.push('prod = ?');
      values.push(prod);
    }
    if (detalles !== undefined) {
      fieldsToUpdate.push('detalles = ?');
      values.push(detalles);
    }
    
    // Siempre actualizar la fecha
    fieldsToUpdate.push('fecha = ?');
    values.push(fechaBogota);
    
    // Agregar el ID al final
    values.push(id);
    
    const query = `UPDATE data_audiencias SET ${fieldsToUpdate.join(', ')} WHERE id_global = ?`;
    console.log(`🔄 Ejecutando query:`, query);
    console.log(`📊 Valores:`, values);
    
    await pool.execute(query, values);
    
    // Obtener el registro DESPUÉS del update para el log
    const registroDespues = await this.getById(id);
    
    console.log(`📋 Estado DESPUÉS del update:`, registroDespues);
    
    // Log del UPDATE (ANTES y DESPUÉS)
    if (registroAntes && registroDespues) {
      console.log(`📝 Generando logs de actualización...`);
      try {
        await logService.logUpdate(registroAntes, registroDespues, usuario);
        console.log(`✅ Logs de actualización generados correctamente`);
      } catch (logError) {
        console.error(`❌ Error al generar logs:`, logError);
        // No lanzar error para no fallar la actualización principal
      }
    } else {
      console.warn(`⚠️ No se pudo generar log: registroAntes=${!!registroAntes}, registroDespues=${!!registroDespues}`);
    }
    
    console.log(`✅ Actualización del registro ${id} completada`);
  },

  async deleteRegistro(id: number, usuario?: Usuario): Promise<void> {
    if (!pool) {
      throw new Error('Servicio de registros no disponible');
    }

    console.log(`🗑️ Iniciando eliminación del registro ${id}`);
    console.log(`👤 Usuario que elimina:`, usuario ? `${usuario.nombre} (${usuario.email})` : 'Sin usuario');
    
    // Obtener el registro ANTES del delete para el log
    const registroAntes = await this.getById(id);
    
    if (!registroAntes) {
      throw new Error(`Registro con ID ${id} no encontrado`);
    }
    
    console.log(`📋 Registro a eliminar:`, registroAntes);
    
    await pool.execute('DELETE FROM data_audiencias WHERE id_global = ?', [id]);
    
    // Log del DELETE
    try {
      await logService.logDelete(registroAntes, usuario);
      console.log(`✅ Log de eliminación generado correctamente`);
    } catch (logError) {
      console.error(`❌ Error al generar log de eliminación:`, logError);
    }
    
    console.log(`✅ Eliminación del registro ${id} completada`);
  }
}; 