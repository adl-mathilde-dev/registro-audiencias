import { NextRequest, NextResponse } from 'next/server';

// Forzar que esta ruta sea dinámica
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Verificación de sesión iniciada');
    console.log('📋 Cookies recibidas:', request.cookies.getAll());
    
    const sessionCookie = request.cookies.get('user_session');
    
    if (!sessionCookie) {
      console.log('❌ No se encontró cookie de sesión');
      return NextResponse.json(
        { success: false, message: 'No hay sesión activa' },
        { status: 401 }
      );
    }

    console.log('🍪 Cookie de sesión encontrada:', sessionCookie.name);
    console.log('📊 Valor de la cookie:', sessionCookie.value.substring(0, 50) + '...');

    // Parsear los datos del usuario desde la cookie
    const userData = JSON.parse(sessionCookie.value);
    console.log('👤 Datos del usuario:', userData);
    
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