'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Calendar, DollarSign, Wallet, CreditCard, Search, ArrowDownToLine, Smartphone } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Historial de Pagos</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cobrado (Mes)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,350.00</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-gray-400 mt-1">$235.50</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Pago</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$116.96</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Buscar por cliente, recibo o referencia..." 
            className="pl-8 bg-gray-900 border-gray-800 text-white"
          />
        </div>
        <select className="flex h-10 w-48 rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white">
          <option>Todos los métodos</option>
          <option>Efectivo USD</option>
          <option>Pago Móvil</option>
          <option>Zelle</option>
          <option>Binance USDT</option>
        </select>
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
                  <TableCell className="text-white font-medium py-3">${pago.monto.toFixed(2)}</TableCell>
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
