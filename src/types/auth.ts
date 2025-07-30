export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  fecha_registro: string;
  activo: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  usuario?: Usuario;
}

export interface SessionData {
  usuario: Usuario;
  sessionId: string;
} 