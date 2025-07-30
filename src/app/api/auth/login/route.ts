import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../../lib/authService';
import { LoginRequest } from '../../../../types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const result = await authService.login({ email, password });

    if (result.success && result.usuario) {
      // Crear respuesta con cookie de sesión
      const response = NextResponse.json(result);
      
      // Establecer cookie con información del usuario (en producción usar JWT)
      response.cookies.set('user_session', JSON.stringify({
        id: result.usuario.id,
        nombre: result.usuario.nombre,
        email: result.usuario.email
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 horas
      });

      return response;
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 