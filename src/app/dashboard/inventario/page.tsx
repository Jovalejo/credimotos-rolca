'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { motoStatusBadgeClass } from '@/lib/status-badges';

const mockMotos = [
  { id: 1, marca: 'Bera', modelo: 'SBR 150', ano: 2024, precioContado: 950, precioCredito: 1200, estado: 'DISPONIBLE', serial: 'VIN1234567890A1' },
  { id: 2, marca: 'Empire', modelo: 'EK Express', ano: 2024, precioContado: 890, precioCredito: 1100, estado: 'VENDIDA', serial: 'VIN0987654321B2' },
  { id: 3, marca: 'Keeway', modelo: 'TX 200', ano: 2023, precioContado: 1400, precioCredito: 1750, estado: 'RESERVADA', serial: 'VIN5678901234C3' },
  { id: 4, marca: 'Suzuki', modelo: 'GN 125', ano: 2024, precioContado: 1250, precioCredito: 1550, estado: 'DISPONIBLE', serial: 'VIN4321098765D4' },
  { id: 5, marca: 'Bera', modelo: 'BR 150', ano: 2023, precioContado: 900, precioCredito: 1150, estado: 'DISPONIBLE', serial: 'VIN1122334455E5' },
  { id: 6, marca: 'Yamaha', modelo: 'FZ 150', ano: 2024, precioContado: 2100, precioCredito: 2600, estado: 'DISPONIBLE', serial: 'VIN9988776655F6' },
  { id: 7, marca: 'UM', modelo: 'Renegade 200', ano: 2023, precioContado: 1600, precioCredito: 1950, estado: 'VENDIDA', serial: 'VIN3344556677G7' },
  { id: 8, marca: 'Skygo', modelo: 'SG 150', ano: 2024, precioContado: 850, precioCredito: 1050, estado: 'DISPONIBLE', serial: 'VIN7766554433H8' },
  { id: 9, marca: 'Honda', modelo: 'Navi', ano: 2024, precioContado: 1300, precioCredito: 1600, estado: 'DISPONIBLE', serial: 'VIN2233445566I9' },
  { id: 10, marca: 'Empire', modelo: 'Horse 150', ano: 2024, precioContado: 920, precioCredito: 1180, estado: 'RESERVADA', serial: 'VIN6677889900J0' },
];

export default function InventarioPage() {
  const [filter, setFilter] = useState('Todos');

  const filteredMotos = filter === 'Todos' ? mockMotos : mockMotos.filter(m => m.estado === filter);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-gray-950 text-white min-h-screen">
      <PageHeader
        title="Inventario de Motocicletas"
        className="mb-6"
        actions={
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Nueva Moto
          </Button>
        }
      />

      <div className="flex items-center space-x-2 mb-6">
        <Filter className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">Filtro:</span>
        <div className="flex gap-2">
          {['Todos', 'DISPONIBLE', 'RESERVADA', 'VENDIDA'].map(f => (
            <Badge 
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              className={`cursor-pointer ${filter === f ? 'bg-red-600 hover:bg-red-700' : 'text-gray-400 border-gray-700 hover:bg-gray-800'}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMotos.map((moto) => (
          <Card key={moto.id} className="bg-gray-900 border-gray-800 flex flex-col">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">🏍️</div>
                <Badge className={motoStatusBadgeClass(moto.estado)}>
                  {moto.estado}
                </Badge>
              </div>
              <div className="mb-4">
                <h3 className="font-bold text-lg text-white">{moto.marca} {moto.modelo}</h3>
                <p className="text-sm text-gray-400">Año: {moto.ano}</p>
                <p className="text-xs text-gray-500 mt-1 font-mono">VIN: {moto.serial}</p>
              </div>
              <div className="mt-auto space-y-2 border-t border-gray-800 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Contado:</span>
                  <span className="font-medium text-white">${moto.precioContado}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Crédito:</span>
                  <span className="font-medium text-red-400">${moto.precioCredito}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
