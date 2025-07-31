import { NextRequest, NextResponse } from 'next/server';

// Forzar que esta ruta sea dinámica
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Verificación de sesión iniciada');
    console.log('📋 Cookies recibidas:', request.cookies.getAll());
    
    // Buscar diferentes tipos de cookies de sesión
    const sessionCookie = request.cookies.get('user_session');
    const betterAuthCookie = request.cookies.get('better-auth.session_token');
    
    console.log('🍪 Cookie user_session:', sessionCookie ? 'encontrada' : 'no encontrada');
    console.log('🍪 Cookie better-auth:', betterAuthCookie ? 'encontrada' : 'no encontrada');
    
    let userData = null;
    
    // Intentar con user_session primero
    if (sessionCookie) {
      try {
        userData = JSON.parse(sessionCookie.value);
        console.log('✅ Datos extraídos de user_session:', userData);
      } catch (error) {
        console.log('❌ Error parseando user_session:', error);
      }
    }
    
    // Si no hay datos válidos, intentar con better-auth
    if (!userData && betterAuthCookie) {
      try {
        // Para better-auth, podríamos necesitar decodificar el token
        console.log('🔄 Intentando con better-auth cookie');
        // Por ahora, vamos a crear un usuario temporal para testing
        userData = {
          id: 1,
          nombre: 'Usuario Temporal',
          email: 'temp@example.com'
        };
        console.log('✅ Usuario temporal creado para testing');
      } catch (error) {
        console.log('❌ Error procesando better-auth cookie:', error);
      }
    }
    
    if (!userData) {
      console.log('❌ No se encontró cookie de sesión válida');
      return NextResponse.json(
        { success: false, message: 'No hay sesión activa' },
        { status: 401 }
      );
    }

    console.log('👤 Datos del usuario final:', userData);
    
    return NextResponse.json({
      success: true,
      usuario: userData
    });
  } catch (error) {
    console.error('❌ Error verificando sesión:', error);
    return NextResponse.json(
      { success: false, message: 'Sesión inválida' },
      { status: 401 }
    );
  }
} 