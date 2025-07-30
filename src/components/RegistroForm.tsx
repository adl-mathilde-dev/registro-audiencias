'use client';

import { useState } from 'react';
import { Registro } from '../types/registro';

interface RegistroFormProps {
  onSubmit: (data: Omit<Registro, 'id_global' | 'id_unico' | 'fecha'>) => void;
}

const CLIENTES = [
  'Banco Av Villas',
  'Banco de Bogotá',
  'Banco Popular',
  'Banco de Occidente',
  'Dale!',
  'Tu➕',
  'CarroYa',
  'El Tiempo'
];

export default function RegistroForm({ onSubmit }: RegistroFormProps) {
  const [data, setData] = useState<Omit<Registro, 'id_global' | 'id_unico' | 'fecha'>>({
    nombre: '',
    cliente: '',
    dev: 'En curso',
    qa: 'En curso',
    prod: 'En curso',
    detalles: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (field: 'dev' | 'qa' | 'prod') => {
    setData(prev => ({
      ...prev,
      [field]: prev[field] === 'En curso' ? 'Finalizado' : 'En curso'
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
    
    // Resetear formulario
    setData({
      nombre: '',
      cliente: '',
      dev: 'En curso',
      qa: 'En curso',
      prod: 'En curso',
      detalles: ''
    });
  };

  return (
    <form className="mth-form" onSubmit={handleSubmit}>
      <h1>Registro de Audiencias</h1>

      <div className="mth-textarea-nombre">
        <label htmlFor="nombre">Nombre de la Audiencia</label>
        <textarea
          name="nombre"
          placeholder="Nombre de la Audiencia"
          minLength={5}
          maxLength={100}
          required
          value={data.nombre}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="mth-select-cliente">
        <label>Cliente</label>
        <select
          name="cliente"
          value={data.cliente}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar Cliente</option>
          {CLIENTES.map(cliente => (
            <option key={cliente} value={cliente}>
              {cliente}
            </option>
          ))}
        </select>
      </div>

      <div className="mth-input-ambiente">
        <p>Ambiente</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-3">
              <label className="font-medium text-gray-700">Dev</label>
              <button
                type="button"
                onClick={() => handleToggleChange('dev')}
                className={`toggle-switch ${data.dev === 'Finalizado' ? 'toggle-switch-on' : 'toggle-switch-off'}`}
                aria-label={`Dev: ${data.dev}`}
              >
                <span className="toggle-switch-slider"></span>
              </button>
            </div>
            <span className="text-sm font-medium text-gray-600">
              Estado: {data.dev}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-3">
              <label className="font-medium text-gray-700">QA</label>
              <button
                type="button"
                onClick={() => handleToggleChange('qa')}
                className={`toggle-switch ${data.qa === 'Finalizado' ? 'toggle-switch-on' : 'toggle-switch-off'}`}
                aria-label={`QA: ${data.qa}`}
              >
                <span className="toggle-switch-slider"></span>
              </button>
            </div>
            <span className="text-sm font-medium text-gray-600">
              Estado: {data.qa}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-3">
              <label className="font-medium text-gray-700">Prod</label>
              <button
                type="button"
                onClick={() => handleToggleChange('prod')}
                className={`toggle-switch ${data.prod === 'Finalizado' ? 'toggle-switch-on' : 'toggle-switch-off'}`}
                aria-label={`Prod: ${data.prod}`}
              >
                <span className="toggle-switch-slider"></span>
              </button>
            </div>
            <span className="text-sm font-medium text-gray-600">
              Estado: {data.prod}
            </span>
          </div>
        </div>
      </div>

      <div className="mth-textarea-adicionales">
        <label htmlFor="detalles">Detalles adicionales</label>
        <textarea
          name="detalles"
          placeholder="Detalles, Observaciones ..."
          minLength={5}
          maxLength={100}
          required
          value={data.detalles}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <button type="submit" className="mth-button">
        Enviar
      </button>
    </form>
  );
} 