import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../../lib/authService';
import { LoginRequest } from '../../../../types/auth';

// Forzar que esta ruta sea dinámica
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Proceso de login iniciado');
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    console.log('📧 Email recibido:', email);

    // Validaciones básicas
    if (!email || !password) {
      console.log('❌ Email o contraseña faltantes');
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const result = await authService.login({ email, password });
    console.log('🔍 Resultado del login:', result.success);

    if (result.success && result.usuario) {
      console.log('✅ Login exitoso, configurando cookie');
      // Crear respuesta con cookie de sesión
      const response = NextResponse.json(result);
      
      const cookieData = {
        id: result.usuario.id,
        nombre: result.usuario.nombre,
        email: result.usuario.email
      };
      
      console.log('🍪 Configurando cookie con datos:', cookieData);
      
      // Establecer cookie con información del usuario (en producción usar JWT)
      response.cookies.set('user_session', JSON.stringify(cookieData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 horas
      });

      console.log('✅ Cookie configurada exitosamente');
      return response;
    } else {
      console.log('❌ Login fallido:', result.message);
      return NextResponse.json(result, { status: 401 });
    }
  } catch (error) {
    console.error('❌ Error en login:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 