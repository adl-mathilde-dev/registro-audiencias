export interface Registro {
  id_global?: number;
  id_unico?: string;
  cliente: string;
  nombre: string;
  dev: 'En curso' | 'Finalizado';
  qa: 'En curso' | 'Finalizado';
  prod: 'En curso' | 'Finalizado';
  detalles: string;
  fecha?: string;
}

export interface CreateRegistroResponse {
  id_global: number;
  id_unico: string;
  message: string;
}

export interface UpdateRegistroRequest {
  dev?: 'En curso' | 'Finalizado';
  qa?: 'En curso' | 'Finalizado';
  prod?: 'En curso' | 'Finalizado';
  detalles?: string;
} 