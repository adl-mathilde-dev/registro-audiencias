import { NextRequest, NextResponse } from 'next/server';
import { registroService } from '../../../../lib/registroService';
import { UpdateRegistroRequest } from '../../../../types/registro';
import { getUserFromRequest } from '../../../../lib/authUtils';

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

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const id = parseInt(params.id);
  
  console.log(`🚀 === INICIO PUT /api/registros/${id} ===`);
  
  try {
    // Verificar autenticación
    console.log('🔐 Verificando autenticación...');
    const usuario = getUserFromRequest(request);
    
    if (!usuario) {
      console.log('❌ Usuario NO autenticado');
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }
    
    console.log('✅ Usuario autenticado:', {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email
    });

    if (isNaN(id)) {
      console.log('❌ ID inválido:', params.id);
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
    }

    console.log('📥 Parseando datos del request...');
    const data: UpdateRegistroRequest = await request.json();
    console.log('📋 Datos recibidos:', data);
    
    // Verificar que el registro existe
    console.log(`🔍 Verificando existencia del registro ${id}...`);
    const existingRegistro = await registroService.getById(id);
    if (!existingRegistro) {
      console.log(`❌ Registro ${id} no encontrado`);
      return NextResponse.json({ message: 'Registro no encontrado' }, { status: 404 });
    }
    
    console.log('✅ Registro existe:', existingRegistro);

    console.log(`🔄 Llamando a registroService.updateRegistro...`);
    await registroService.updateRegistro(id, data, usuario);
    console.log(`✅ registroService.updateRegistro completado`);
    
    console.log(`🎉 === FIN EXITOSO PUT /api/registros/${id} ===`);
    return NextResponse.json({ message: 'Registro actualizado exitosamente' });
    
  } catch (error) {
    console.error(`❌ === ERROR EN PUT /api/registros/${id} ===`);
    console.error('❌ Error completo:', error);
    console.error('❌ Stack trace:', (error as Error).stack);
    
    return NextResponse.json(
      { message: 'Error interno del servidor', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar autenticación  
    const usuario = getUserFromRequest(request);
    if (!usuario) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
    }

    // Verificar que el registro existe
    const existingRegistro = await registroService.getById(id);
    if (!existingRegistro) {
      return NextResponse.json({ message: 'Registro no encontrado' }, { status: 404 });
    }

    await registroService.deleteRegistro(id, usuario);
    return NextResponse.json({ message: 'Registro eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar registro:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: (error as Error).message },
      { status: 500 }
    );
  }
} 