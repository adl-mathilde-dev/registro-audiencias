import { NextRequest, NextResponse } from 'next/server';

// Forzar que esta ruta sea dinámica
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: 'No hay sesión activa' },
        { status: 401 }
      );
    }

    // Parsear los datos del usuario desde la cookie
    const userData = JSON.parse(sessionCookie.value);
    
    return NextResponse.json({
      success: true,
      usuario: userData
    });
  } catch (error) {
    console.error('Error verificando sesión:', error);
    return NextResponse.json(
      { success: false, message: 'Sesión inválida' },
      { status: 401 }
    );
  }
} 