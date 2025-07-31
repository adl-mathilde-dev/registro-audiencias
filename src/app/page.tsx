'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RegistroForm from '../components/RegistroForm';
import RegistroTable from '../components/RegistroTable';
import { Registro } from '../types/registro';
import { Usuario } from '../types/auth';
import { getBogotaDateForUI } from '../lib/dateUtils';

export default function HomePage() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Verificar autenticación al cargar la página
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Cargar registros cuando el usuario esté autenticado
  useEffect(() => {
    if (usuario) {
      loadRegistros();
    }
  }, [usuario]);

  const checkAuthentication = async () => {
    try {
      console.log('🔍 Verificando autenticación...');
      // Verificar si hay una sesión válida mediante una cookie
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include'
      });

      console.log('📋 Respuesta de verificación:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Datos de verificación:', data);
        if (data.success && data.usuario) {
          console.log('✅ Usuario autenticado:', data.usuario);
          setUsuario(data.usuario);
        } else {
          console.log('❌ Verificación fallida, redirigiendo a login');
          router.push('/login');
        }
      } else {
        console.log('❌ Error en verificación:', response.status, response.statusText);
        router.push('/login');
      }
    } catch (error) {
      console.error('❌ Error verificando autenticación:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRegistros = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/registros');
      if (!response.ok) {
        throw new Error('Error al cargar registros');
      }
      const data = await response.json();
      setRegistros(data);
    } catch (err) {
      setError('Error al cargar registros: ' + (err as Error).message);
      console.error('Error loading registros:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRegistro = async (data: Omit<Registro, 'id_global' | 'id_unico' | 'fecha'>) => {
    try {
      const response = await fetch('/api/registros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear registro');
      }

      const result = await response.json();
      
      // Crear el nuevo registro para agregarlo a la lista
      const nuevoRegistro: Registro = {
        id_global: result.id_global,
        id_unico: result.id_unico,
        ...data,
        fecha: getBogotaDateForUI()
      };

      // Agregar el nuevo registro al inicio de la lista
      setRegistros(prev => [nuevoRegistro, ...prev]);
      
      alert('Registro creado exitosamente');
    } catch (err) {
      alert('Error al crear registro: ' + (err as Error).message);
      console.error('Error creating registro:', err);
    }
  };

  const handleUpdateRegistro = async (id: number, field: 'dev' | 'qa' | 'prod') => {
    try {
      // Encontrar el registro actual
      const registro = registros.find(r => r.id_global === id);
      if (!registro) return;

      // Cambiar el estado del campo
      const nuevoEstado = registro[field] === 'En curso' ? 'Finalizado' : 'En curso';
      
      // CORREGIDO: Solo enviar el campo que cambia
      const updateData = { [field]: nuevoEstado };
      
      console.log(`🔄 Actualizando registro ${id}, campo ${field}:`, updateData);
      
      const response = await fetch(`/api/registros/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar registro');
      }

      // Actualizar el estado local
      setRegistros(prev => prev.map(reg => 
        reg.id_global === id 
          ? { ...reg, [field]: nuevoEstado, fecha: getBogotaDateForUI() }
          : reg
      ));
      
      console.log(`✅ Registro ${id} actualizado correctamente en ${field}: ${nuevoEstado}`);
    } catch (err) {
      alert('Error al actualizar registro: ' + (err as Error).message);
      console.error('Error updating registro:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="mth-audiencias-container">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-gray-600">Cargando registros...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mth-audiencias-container">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-600">{error}</div>
          <button 
            onClick={loadRegistros}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Verificando autenticación...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header con información del usuario */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Sistema de Registro de Audiencias
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bienvenido, <span className="font-medium">{usuario.nombre}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="mth-audiencias-container">
        <RegistroForm onSubmit={handleCreateRegistro} />
        <RegistroTable 
          registros={registros} 
          onUpdateRegistro={handleUpdateRegistro}
        />
      </div>
    </div>
  );
} 