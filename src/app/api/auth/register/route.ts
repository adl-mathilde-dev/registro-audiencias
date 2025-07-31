import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../../lib/authService';
import { RegisterRequest } from '../../../../types/auth';

// Forzar que esta ruta sea dinámica
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { nombre, email, password } = body;

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const result = await authService.register({ nombre, email, password });

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 