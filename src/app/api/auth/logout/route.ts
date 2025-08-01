import { NextRequest, NextResponse } from 'next/server';

// Forzar que esta ruta sea dinámica
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 Proceso de logout iniciado');
    console.log('📋 Cookies antes del logout:', request.cookies.getAll());
    
    const response = NextResponse.json({ success: true, message: 'Sesión cerrada exitosamente' });
    
    // Eliminar todas las cookies de sesión posibles
    response.cookies.set('user_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expirar inmediatamente
    });

    // También limpiar la cookie better-auth si existe
    response.cookies.set('better-auth.session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expirar inmediatamente
    });

    console.log('✅ Cookies de sesión eliminadas');
    return response;
  } catch (error) {
    console.error('❌ Error en logout:', error);
    return NextResponse.json(
      { success: false, message: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
} 