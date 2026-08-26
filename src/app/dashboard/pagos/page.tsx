'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { SearchInput } from '@/components/shared/search-input';
import { formatMoney } from '@/lib/utils';
import { Calendar, DollarSign, Wallet, CreditCard, ArrowDownToLine, Smartphone } from 'lucide-react';

const pagosMock = [
  { id: 'REC-5021', fecha: '25/08/2026', cliente: 'Carlos Mendoza', credito: 'CRD-1024', monto: 150.00, metodo: 'Pago Móvil', ref: '00123456', estado: 'Completado' },
  { id: 'REC-5020', fecha: '25/08/2026', cliente: 'María Rodríguez', credito: 'CRD-0955', monto: 85.50, metodo: 'Efectivo USD', ref: '-', estado: 'Completado' },
  { id: 'REC-5019', fecha: '24/08/2026', cliente: 'José González', credito: 'CRD-1025', monto: 200.00, metodo: 'Zelle', ref: 'Z-889900', estado: 'Completado' },
  { id: 'REC-5018', fecha: '24/08/2026', cliente: 'Ana Silva', credito: 'CRD-0850', monto: 50.00, metodo: 'Pago Móvil', ref: '00987654', estado: 'Completado' },
  { id: 'REC-5017', fecha: '23/08/2026', cliente: 'Luis Pérez', credito: 'CRD-0910', monto: 150.00, metodo: 'Binance USDT', ref: 'BIN-112233', estado: 'Completado' },
  { id: 'REC-5016', fecha: '23/08/2026', cliente: 'Pedro Martínez', credito: 'CRD-0992', monto: 145.83, metodo: 'Punto de Venta', ref: '55667788', estado: 'Completado' },
  { id: 'REC-5015', fecha: '22/08/2026', cliente: 'Juan García', credito: 'CRD-1026', monto: 108.33, metodo: 'Transferencia', ref: '11223344', estado: 'Completado' },
  { id: 'REC-5014', fecha: '22/08/2026', cliente: 'Carmen López', credito: 'CRD-0810', monto: 65.00, metodo: 'Efectivo USD', ref: '-', estado: 'Completado' },
  { id: 'REC-5013', fecha: '21/08/2026', cliente: 'Roberto Gómez', credito: 'CRD-0930', monto: 120.00, metodo: 'Zelle', ref: 'Z-445566', estado: 'Completado' },
  { id: 'REC-5012', fecha: '21/08/2026', cliente: 'Sofía Vargas', credito: 'CRD-0980', monto: 95.00, metodo: 'Pago Móvil', ref: '00334455', estado: 'Completado' },
];

const MetodoIcon = ({ metodo }: { metodo: string }) => {
  switch(metodo) {
    case 'Efectivo USD': return <DollarSign className="w-4 h-4 mr-1 text-green-500" />;
    case 'Pago Móvil': return <Smartphone className="w-4 h-4 mr-1 text-blue-400" />;
    case 'Zelle': return <Wallet className="w-4 h-4 mr-1 text-purple-500" />;
    case 'Binance USDT': return <Wallet className="w-4 h-4 mr-1 text-yellow-500" />;
    case 'Punto de Venta': return <CreditCard className="w-4 h-4 mr-1 text-gray-400" />;
    case 'Transferencia': return <ArrowDownToLine className="w-4 h-4 mr-1 text-orange-400" />;
    default: return <DollarSign className="w-4 h-4 mr-1" />;
  }
};

export default function PagosPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-gray-950 text-white min-h-screen">
      <PageHeader title="Historial de Pagos" className="mb-6" />

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard title="Total Cobrado (Mes)" value="$8,350.00" icon={DollarSign} iconClassName="text-green-500" />
        <StatCard
          title="Pagos Hoy"
          value="2"
          icon={Calendar}
          iconClassName="text-blue-500"
          footer={<p className="text-xs text-gray-400 mt-1">$235.50</p>}
        />
        <StatCard title="Promedio por Pago" value="$116.96" icon={CreditCard} iconClassName="text-purple-500" />
      </div>

      <div className="flex gap-4 mb-4">
        <SearchInput placeholder="Buscar por cliente, recibo o referencia..." />
        <NativeSelect className="w-48 bg-gray-900">
          <option>Todos los métodos</option>
          <option>Efectivo USD</option>
          <option>Pago Móvil</option>
          <option>Zelle</option>
          <option>Binance USDT</option>
        </NativeSelect>
        <Input type="date" className="bg-gray-900 border-gray-800 text-white w-40" />
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-900/50">
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400 py-3">N° Recibo</TableHead>
                <TableHead className="text-gray-400 py-3">Fecha</TableHead>
                <TableHead className="text-gray-400 py-3">Cliente</TableHead>
                <TableHead className="text-gray-400 py-3">Crédito</TableHead>
                <TableHead className="text-gray-400 py-3">Monto USD</TableHead>
                <TableHead className="text-gray-400 py-3">Método de Pago</TableHead>
                <TableHead className="text-gray-400 py-3">Referencia</TableHead>
                <TableHead className="text-gray-400 text-right py-3">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagosMock.map((pago) => (
                <TableRow key={pago.id} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="text-gray-300 font-medium py-3">{pago.id}</TableCell>
                  <TableCell className="text-gray-300 py-3">{pago.fecha}</TableCell>
                  <TableCell className="text-gray-300 py-3">{pago.cliente}</TableCell>
                  <TableCell className="text-blue-400 py-3 hover:underline cursor-pointer">{pago.credito}</TableCell>
                  <TableCell className="text-white font-medium py-3">{formatMoney(pago.monto)}</TableCell>
                  <TableCell className="text-gray-300 py-3">
                    <div className="flex items-center">
                      <MetodoIcon metodo={pago.metodo} />
                      {pago.metodo}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400 font-mono text-sm py-3">{pago.ref}</TableCell>
                  <TableCell className="text-right py-3">
                    <Badge className="bg-green-600 hover:bg-green-700">
                      {pago.estado}
                    </Badge>
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
