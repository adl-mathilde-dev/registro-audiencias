import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../../lib/authService';
import { RegisterRequest } from '../../../../types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { nombre, email, password } = body;

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Validar longitud de password
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    const result = await authService.register({ nombre, email, password });

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
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