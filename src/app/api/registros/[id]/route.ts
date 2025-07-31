import { NextRequest, NextResponse } from 'next/server';
import { registroService } from '../../../../lib/registroService';
import { getUserFromRequest } from '../../../../lib/authUtils';

// Forzar que esta ruta sea dinámica
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
    }

    const registro = await registroService.getById(id);
    if (!registro) {
      return NextResponse.json({ message: 'Registro no encontrado' }, { status: 404 });
    }

    return NextResponse.json(registro);
  } catch (error) {
    console.error('Error al obtener registro:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const usuario = getUserFromRequest(request);
    if (!usuario) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);
    const data = await request.json();
    
    await registroService.updateRegistro(id, data, usuario);
    
    return NextResponse.json({ success: true, message: 'Registro actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const usuario = getUserFromRequest(request);
    if (!usuario) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);
    
    await registroService.deleteRegistro(id, usuario);
    
    return NextResponse.json({ success: true, message: 'Registro eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 