'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { creditStatusBadgeClass } from '@/lib/status-badges';
import { formatMoney } from '@/lib/utils';

const mockCreditos = [
  { id: 'CRD-1024', cliente: 'Carlos Mendoza', moto: 'Bera SBR 150', monto: 1200, cuota: 150, frecuencia: 'Mensual', cuotasPagadas: 4, cuotasTotal: 8, estado: 'ACTIVO' },
  { id: 'CRD-1025', cliente: 'José González', moto: 'Suzuki GN 125', monto: 1550, cuota: 77.5, frecuencia: 'Quincenal', cuotasPagadas: 2, cuotasTotal: 20, estado: 'ACTIVO' },
  { id: 'CRD-0850', cliente: 'Ana Silva', moto: 'Empire EK Express', monto: 950, cuota: 237.5, frecuencia: 'Mensual', cuotasPagadas: 4, cuotasTotal: 4, estado: 'COMPLETADO' },
  { id: 'CRD-0992', cliente: 'Pedro Martínez', moto: 'Keeway TX 200', monto: 1750, cuota: 145.83, frecuencia: 'Mensual', cuotasPagadas: 5, cuotasTotal: 12, estado: 'EN MORA' },
  { id: 'CRD-1026', cliente: 'Juan García', moto: 'Yamaha FZ 150', monto: 2600, cuota: 108.33, frecuencia: 'Quincenal', cuotasPagadas: 1, cuotasTotal: 24, estado: 'ACTIVO' },
  { id: 'CRD-0910', cliente: 'Luis Pérez', moto: 'Honda Navi', monto: 1600, cuota: 133.33, frecuencia: 'Mensual', cuotasPagadas: 12, cuotasTotal: 12, estado: 'COMPLETADO' },
];

export default function CreditosPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-gray-950 text-white min-h-screen">
      <PageHeader
        title="Gestión de Créditos"
        className="mb-6"
        actions={
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
            <Link href="/dashboard/creditos/nuevo">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Crédito
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard title="Créditos Activos" value="42" icon={Clock} iconClassName="text-green-500" />
        <StatCard title="Completados" value="128" icon={CheckCircle} iconClassName="text-blue-500" />
        <StatCard title="En Mora" value="7" icon={AlertTriangle} iconClassName="text-red-500" />
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-900/50">
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400 py-3">N° Crédito</TableHead>
                <TableHead className="text-gray-400 py-3">Cliente</TableHead>
                <TableHead className="text-gray-400 py-3">Motocicleta</TableHead>
                <TableHead className="text-gray-400 py-3">Financiamiento</TableHead>
                <TableHead className="text-gray-400 py-3">Cuota / Frec.</TableHead>
                <TableHead className="text-gray-400 py-3">Progreso</TableHead>
                <TableHead className="text-gray-400 py-3">Estado</TableHead>
                <TableHead className="text-gray-400 text-right py-3">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCreditos.map((credito) => (
                <TableRow key={credito.id} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="text-gray-300 font-medium py-3">{credito.id}</TableCell>
                  <TableCell className="text-gray-300 py-3">{credito.cliente}</TableCell>
                  <TableCell className="text-gray-300 py-3">{credito.moto}</TableCell>
                  <TableCell className="text-gray-300 py-3">{formatMoney(credito.monto)}</TableCell>
                  <TableCell className="text-gray-300 py-3">
                    {formatMoney(credito.cuota)} <span className="text-gray-500 text-xs">/ {credito.frecuencia}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-1 w-32">
                      <span className="text-xs text-gray-400">{credito.cuotasPagadas}/{credito.cuotasTotal} cuotas</span>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div 
                          className="bg-red-600 h-1.5 rounded-full" 
                          style={{ width: `${(credito.cuotasPagadas / credito.cuotasTotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge className={creditStatusBadgeClass(credito.estado)}>
                      {credito.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <Button variant="ghost" size="sm" asChild className="text-blue-400 hover:text-blue-300">
                      <Link href={`/dashboard/creditos/${credito.id}`}>Ver Detalle</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
