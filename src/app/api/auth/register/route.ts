import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../../lib/authService';
import { RegisterRequest } from '../../../../types/auth';

// Forzar que esta ruta sea dinámica
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Proceso de registro iniciado');
    const body: RegisterRequest = await request.json();
    const { nombre, email, password } = body;

    console.log('👤 Datos de registro:', { nombre, email });

    // Validaciones básicas
    if (!nombre || !email || !password) {
      console.log('❌ Campos faltantes en registro');
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const result = await authService.register({ nombre, email, password });
    console.log('🔍 Resultado del registro:', result.success);

    if (result.success && result.usuario) {
      console.log('✅ Registro exitoso, configurando cookie');
      // Crear respuesta con cookie de sesión
      const response = NextResponse.json(result);
      
      const cookieData = {
        id: result.usuario.id,
        nombre: result.usuario.nombre,
        email: result.usuario.email
      };
      
      console.log('🍪 Configurando cookie con datos:', cookieData);
      
      // Establecer cookie con información del usuario
      response.cookies.set('user_session', JSON.stringify(cookieData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 horas
      });

      console.log('✅ Cookie configurada exitosamente en registro');
      return response;
    } else {
      console.log('❌ Registro fallido:', result.message);
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Error en registro:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 