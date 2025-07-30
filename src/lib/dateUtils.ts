// Utilidades para manejo de fechas en zona horaria de Bogotá (UTC-5)

export const BOGOTA_TIMEZONE = 'America/Bogota';

/**
 * Obtiene la fecha actual en zona horaria de Bogotá
 * @returns {Date} Fecha actual en Bogotá
 */
export function getBogotaDate(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: BOGOTA_TIMEZONE }));
}

/**
 * Convierte una fecha a formato ISO pero ajustada para Bogotá
 * @returns {string} Fecha en formato YYYY-MM-DD HH:mm:ss para MySQL
 */
export function getBogotaDateForMySQL(): string {
  const bogotaDate = getBogotaDate();
  
  // Formato YYYY-MM-DD HH:mm:ss para MySQL
  return bogotaDate.getFullYear() + '-' +
    String(bogotaDate.getMonth() + 1).padStart(2, '0') + '-' +
    String(bogotaDate.getDate()).padStart(2, '0') + ' ' +
    String(bogotaDate.getHours()).padStart(2, '0') + ':' +
    String(bogotaDate.getMinutes()).padStart(2, '0') + ':' +
    String(bogotaDate.getSeconds()).padStart(2, '0');
}

/**
 * Convierte una fecha a formato ISO ajustada para Bogotá
 * @returns {string} Fecha en formato ISO para JavaScript
 */
export function getBogotaDateISO(): string {
  return getBogotaDate().toISOString();
}

/**
 * Formatea una fecha para mostrar en la UI (formato colombiano)
 * @param {string | Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada (DD/MM/YY HH:mm AM/PM)
 */
export function formatFechaColombiana(fecha: string | Date): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
  
  // Convertir a zona horaria de Bogotá
  const fechaBogota = new Date(fechaObj.toLocaleString("en-US", { timeZone: BOGOTA_TIMEZONE }));
  
  const dia = fechaBogota.getDate().toString().padStart(2, '0');
  const mes = (fechaBogota.getMonth() + 1).toString().padStart(2, '0');
  const año = fechaBogota.getFullYear().toString().slice(-2);

  let horas = fechaBogota.getHours();
  const minutos = fechaBogota.getMinutes().toString().padStart(2, '0');
  const ampm = horas >= 12 ? 'PM' : 'AM';
  horas = horas % 12 || 12;

  return `${dia}/${mes}/${año} ${horas}:${minutos} ${ampm}`;
} 