import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { Usuario } from '../types/auth';

// Para uso en Server Components (páginas)
export function getUserFromSession(): Usuario | null {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('user_session');
    const betterAuthCookie = cookieStore.get('better-auth.session_token');
    
    console.log('🔍 getUserFromSession - Cookies disponibles:', {
      user_session: sessionCookie ? 'encontrada' : 'no encontrada',
      better_auth: betterAuthCookie ? 'encontrada' : 'no encontrada'
    });
    
    let userData = null;
    
    // Intentar con user_session primero
    if (sessionCookie) {
      try {
        userData = JSON.parse(sessionCookie.value);
        console.log('✅ Datos extraídos de user_session en session:', userData);
      } catch (error) {
        console.log('❌ Error parseando user_session en session:', error);
      }
    }
    
    // Si no hay datos válidos, intentar con better-auth
    if (!userData && betterAuthCookie) {
      try {
        console.log('🔄 Intentando con better-auth cookie en session');
        // Por ahora, vamos a crear un usuario temporal para testing
        userData = {
          id: 1,
          nombre: 'Usuario Temporal',
          email: 'temp@example.com'
        };
        console.log('✅ Usuario temporal creado para testing en session');
      } catch (error) {
        console.log('❌ Error procesando better-auth cookie en session:', error);
      }
    }
    
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
    const betterAuthCookie = request.cookies.get('better-auth.session_token');
    
    console.log('🔍 getUserFromRequest - Cookies disponibles:', {
      user_session: sessionCookie ? 'encontrada' : 'no encontrada',
      better_auth: betterAuthCookie ? 'encontrada' : 'no encontrada'
    });
    
    let userData = null;
    
    // Intentar con user_session primero
    if (sessionCookie) {
      try {
        userData = JSON.parse(sessionCookie.value);
        console.log('✅ Datos extraídos de user_session en request:', userData);
      } catch (error) {
        console.log('❌ Error parseando user_session en request:', error);
      }
    }
    
    // Si no hay datos válidos, intentar con better-auth
    if (!userData && betterAuthCookie) {
      try {
        console.log('🔄 Intentando con better-auth cookie en request');
        // Por ahora, vamos a crear un usuario temporal para testing
        userData = {
          id: 1,
          nombre: 'Usuario Temporal',
          email: 'temp@example.com'
        };
        console.log('✅ Usuario temporal creado para testing en request');
      } catch (error) {
        console.log('❌ Error procesando better-auth cookie en request:', error);
      }
    }
    
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