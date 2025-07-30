import { NextRequest, NextResponse } from 'next/server';
import { logService } from '../../../lib/logService';
import { getUserFromRequest } from '../../../lib/authUtils';

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

    console.log('🧪 INICIANDO TEST DE LOGGING');
    console.log('👤 Usuario de prueba:', usuario);

    // Test 1: Insertar log directo
    console.log('📝 Test 1: Insertando log de prueba...');
    
    await logService.insertLog({
      accion: 'UPDATE',
      estado: 'ANTES',
      id_global: 999,
      id_unico: 'TEST001',
      cliente: 'Test Cliente',
      nombre: 'Test Audiencia',
      fecha: new Date().toISOString(),
      dev: 'En curso',
      qa: 'En curso', 
      prod: 'En curso',
      detalles: 'Test de logging',
      usuario_id: usuario.id,
      usuario_nombre: usuario.nombre,
      usuario_email: usuario.email
    });

    console.log('✅ Log de prueba insertado');

    // Test 2: Obtener logs recientes
    console.log('📋 Test 2: Obteniendo logs recientes...');
    const logs = await logService.getRecentLogs(5);
    console.log(`📊 Logs encontrados: ${logs.length}`);

    return NextResponse.json({
      success: true,
      message: 'Test de logging completado',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      },
      logsCount: logs.length,
      logs: logs
    });

  } catch (error) {
    console.error('❌ ERROR en test de logging:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error en test de logging', 
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 