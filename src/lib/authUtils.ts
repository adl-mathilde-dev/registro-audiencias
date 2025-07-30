import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { Usuario } from '../types/auth';

// Para uso en Server Components (páginas)
export function getUserFromSession(): Usuario | null {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return null;
    }

    const userData = JSON.parse(sessionCookie.value);
    return userData as Usuario;
  } catch (error) {
    console.error('Error al obtener usuario de sesión:', error);
    return null;
  }
}

// Para uso en API Routes - ESTA ES LA FUNCIÓN CORRECTA PARA APIs
export function getUserFromRequest(request: NextRequest): Usuario | null {
  try {
    const sessionCookie = request.cookies.get('user_session');
    
    if (!sessionCookie) {
      return null;
    }

    const userData = JSON.parse(sessionCookie.value);
    return userData as Usuario;
  } catch (error) {
    console.error('Error al obtener usuario de request:', error);
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getUserFromSession() !== null;
}

export function isAuthenticatedFromRequest(request: NextRequest): boolean {
  return getUserFromRequest(request) !== null;
} 