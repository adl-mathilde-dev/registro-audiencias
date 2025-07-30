'use client';

import React, { useState } from 'react';
import { Registro } from '../types/registro';
import { formatFechaColombiana } from '../lib/dateUtils';

interface RegistroTableProps {
  registros: Registro[];
  onUpdateRegistro: (id: number, field: 'dev' | 'qa' | 'prod') => void;
}

export default function RegistroTable({ registros, onUpdateRegistro }: RegistroTableProps) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const registrosPorPagina = 10;

  // Usar la función de formateo con zona horaria de Bogotá
  const formatFecha = (fechaISO: string) => {
    return formatFechaColombiana(fechaISO);
  };

  const toggleRow = (id_global: number) => {
    setExpandedRows(prev =>
      prev.includes(id_global) ? prev.filter(rowId => rowId !== id_global) : [...prev, id_global]
    );
  };

  const handleToggleChange = (id: number, field: 'dev' | 'qa' | 'prod', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdateRegistro(id, field);
  };

  // Lógica de paginación
  const totalPaginas = Math.ceil(registros.length / registrosPorPagina);
  const indiceInicio = (currentPage - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const registrosPaginados = registros.slice(indiceInicio, indiceFin);

  const irAPagina = (pagina: number) => {
    setCurrentPage(pagina);
    setExpandedRows([]); // Colapsar todas las filas al cambiar de página
  };

  return (
    <div className="mth-table-container">
      <h2>Tabla de Audiencias</h2>
      <div className="overflow-x-auto">
        <table className="mth-table">
          <thead>
            <tr>
              <th className="w-20">Id</th>
              <th className="min-w-[200px]">Nombre</th>
              <th className="hidden sm:table-cell w-40">Cliente</th>
              <th className="hidden lg:table-cell w-32">Fecha</th>
              <th className="w-20">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {registrosPaginados.map((registro) => (
              <React.Fragment key={registro.id_global}>
                <tr>
                  <td className="font-mono text-xs truncate" title={registro.id_unico}>
                    {registro.id_unico}
                  </td>
                  <td className="truncate" title={registro.nombre}>
                    <div className="truncate">
                      {registro.nombre}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell text-xs truncate" title={registro.cliente}>
                    <div className="truncate">
                      {registro.cliente}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell text-xs truncate" title={registro.fecha ? formatFecha(registro.fecha) : 'N/A'}>
                    <div className="truncate">
                      {registro.fecha ? formatFecha(registro.fecha) : 'N/A'}
                    </div>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => registro.id_global && toggleRow(registro.id_global)}
                      className="expand-button"
                      title="Ver detalles y estados"
                    >
                      <span className="hidden md:inline text-xs">
                        {expandedRows.includes(registro.id_global || 0) ? 'Cerrar' : 'Detalles'}
                      </span>
                      <span className="md:hidden">
                        {expandedRows.includes(registro.id_global || 0) ? '▲' : '▼'}
                      </span>
                    </button>
                  </td>
                </tr>
                {expandedRows.includes(registro.id_global || 0) && (
                  <tr>
                    <td colSpan={5} className="expanded-content">
                      <div className="space-y-4">
                        {/* Información básica (solo en mobile) */}
                        <div className="sm:hidden space-y-2">
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Cliente:</span> {registro.cliente}
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Fecha:</span> {registro.fecha ? formatFecha(registro.fecha) : 'N/A'}
                          </div>
                        </div>

                        {/* Estados de ambientes - SIEMPRE VISIBLE */}
                        <div className="bg-gray-100 p-3 rounded-md">
                          <h4 className="font-medium mb-3 text-sm text-gray-800">Estados de Ambientes:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Dev */}
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700 text-sm">Dev</span>
                                <button
                                  type="button"
                                  onClick={(e) => registro.id_global && handleToggleChange(registro.id_global, 'dev', e)}
                                  className={`toggle-switch-small ${registro.dev === 'Finalizado' ? 'toggle-switch-on' : 'toggle-switch-off'}`}
                                  aria-label={`Dev: ${registro.dev}`}
                                >
                                  <span className="toggle-switch-slider-small"></span>
                                </button>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                registro.dev === 'Finalizado' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {registro.dev}
                              </span>
                            </div>

                            {/* QA */}
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700 text-sm">QA</span>
                                <button
                                  type="button"
                                  onClick={(e) => registro.id_global && handleToggleChange(registro.id_global, 'qa', e)}
                                  className={`toggle-switch-small ${registro.qa === 'Finalizado' ? 'toggle-switch-on' : 'toggle-switch-off'}`}
                                  aria-label={`QA: ${registro.qa}`}
                                >
                                  <span className="toggle-switch-slider-small"></span>
                                </button>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                registro.qa === 'Finalizado' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {registro.qa}
                              </span>
                            </div>

                            {/* Prod */}
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700 text-sm">Prod</span>
                                <button
                                  type="button"
                                  onClick={(e) => registro.id_global && handleToggleChange(registro.id_global, 'prod', e)}
                                  className={`toggle-switch-small ${registro.prod === 'Finalizado' ? 'toggle-switch-on' : 'toggle-switch-off'}`}
                                  aria-label={`Prod: ${registro.prod}`}
                                >
                                  <span className="toggle-switch-slider-small"></span>
                                </button>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                registro.prod === 'Finalizado' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {registro.prod}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Detalles */}
                        <div className="bg-blue-50 p-3 rounded-md">
                          <h4 className="font-medium mb-2 text-sm text-gray-800">Detalles Adicionales:</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{registro.detalles}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        
        {registros.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay registros disponibles
          </div>
        )}
      </div>

      {/* Controles de paginación */}
      {totalPaginas > 1 && (
        <div className="mt-4 flex items-center justify-between">
          {/* Información de página */}
          <div className="text-sm text-gray-700">
            Mostrando {indiceInicio + 1} a {Math.min(indiceFin, registros.length)} de {registros.length} registros
          </div>
          
          {/* Navegación */}
          <div className="flex items-center space-x-2">
            {/* Botón Anterior */}
            <button
              onClick={() => irAPagina(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {/* Números de página */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                <button
                  key={pagina}
                  onClick={() => irAPagina(pagina)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === pagina
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pagina}
                </button>
              ))}
            </div>
            
            {/* Botón Siguiente */}
            <button
              onClick={() => irAPagina(currentPage + 1)}
              disabled={currentPage === totalPaginas}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 