import { NextRequest, NextResponse } from 'next/server';
import { registroService } from '../../../lib/registroService';
import { getUserFromRequest } from '../../../lib/authUtils';

// Forzar que esta ruta sea dinámica
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const registros = await registroService.getAll();
    return NextResponse.json(registros);
  } catch (error) {
    console.error('Error al obtener registros:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
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
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const result = await registroService.insertRegistro(data, usuario);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error al crear registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 