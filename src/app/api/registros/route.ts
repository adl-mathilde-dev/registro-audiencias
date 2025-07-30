import { NextRequest, NextResponse } from 'next/server';
import { registroService } from '../../../lib/registroService';
import { Registro } from '../../../types/registro';
import { getUserFromRequest } from '../../../lib/authUtils';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const usuario = getUserFromRequest(request);
    if (!usuario) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const registros = await registroService.getAll();
    return NextResponse.json(registros);
  } catch (error) {
    console.error('Error al obtener registros:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const usuario = getUserFromRequest(request);
    if (!usuario) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const data: Omit<Registro, 'id_global' | 'id_unico' | 'fecha'> = await request.json();
    
    const result = await registroService.insertRegistro(data, usuario);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error al crear registro:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: (error as Error).message },
      { status: 500 }
    );
  }
} 