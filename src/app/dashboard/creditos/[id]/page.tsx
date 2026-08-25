'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CreditCard, DollarSign } from 'lucide-react';
import Link from 'next/link';

const creditDetail = {
  id: 'CRD-1024',
  cliente: 'Carlos Mendoza',
  cedula: 'V-12345678',
  moto: 'Bera SBR 150',
  fechaEmision: '15/01/2026',
  precioTotal: 1200,
  inicial: 360,
  montoFinanciado: 840,
  cuota: 70,
  frecuencia: 'Mensual',
  estado: 'ACTIVO'
};

const amortizacion = Array.from({ length: 12 }).map((_, i) => {
  let estado = 'PENDIENTE';
  if (i < 4) estado = 'PAGADO';
  if (i === 4) estado = 'EN MORA';
  
  const cuotaNum = i + 1;
  const fecha = new Date(2026, 1 + i, 15);
  const saldo = 840 - (cuotaNum * 70);

  return {
    nro: cuotaNum,
    fechaVencimiento: fecha.toLocaleDateString('es-VE'),
    monto: 70.00,
    montoPagado: estado === 'PAGADO' ? 70.00 : 0,
    saldo: Math.max(0, saldo),
    estado
  };
});

export default function DetalleCreditoPage({ params }: { params: { id: string } }) {
  const [open, setOpen] = useState(false);
  const [selectedCuota, setSelectedCuota] = useState('5');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-gray-950 text-white min-h-screen">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-white hover:bg-gray-800">
          <Link href="/dashboard/creditos">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Crédito {creditDetail.id}</h2>
          <p className="text-gray-400">{creditDetail.cliente} • {creditDetail.moto}</p>
        </div>
        <Badge className="ml-auto bg-green-600">{creditDetail.estado}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Monto Financiado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${creditDetail.montoFinanciado.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Cuota {creditDetail.frecuencia}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${creditDetail.cuota.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Saldo Restante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${(creditDetail.montoFinanciado - (4 * 70)).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800 flex items-center justify-center">
          <CardContent className="p-4 w-full">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-12">
                  <DollarSign className="mr-2 h-5 w-5" /> Registrar Pago
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-white border-gray-800">
                <DialogHeader>
                  <DialogTitle>Registrar Pago</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Cuota a Pagar</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white"
                      value={selectedCuota}
                      onChange={(e) => setSelectedCuota(e.target.value)}
                    >
                      {amortizacion.filter(a => a.estado !== 'PAGADO').map(a => (
                        <option key={a.nro} value={a.nro}>Cuota {a.nro} - ${a.monto.toFixed(2)} ({a.estado})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Monto (USD)</Label>
                    <Input defaultValue="70.00" className="bg-gray-950 border-gray-800 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>Método de Pago</Label>
                    <select className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white">
                      <option>Pago Móvil</option>
                      <option>Efectivo USD</option>
                      <option>Zelle</option>
                      <option>Binance USDT</option>
                      <option>Punto de Venta</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Número de Referencia</Label>
                    <Input placeholder="Ej. 12345678" className="bg-gray-950 border-gray-800 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>Notas (Opcional)</Label>
                    <Input className="bg-gray-950 border-gray-800 text-white" />
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-4" onClick={() => setOpen(false)}>
                    Procesar Pago
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-gray-400" /> Tabla de Amortización
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">N° Cuota</TableHead>
                <TableHead className="text-gray-400">Fecha Venc.</TableHead>
                <TableHead className="text-gray-400">Monto</TableHead>
                <TableHead className="text-gray-400">Monto Pagado</TableHead>
                <TableHead className="text-gray-400">Saldo Crédito</TableHead>
                <TableHead className="text-gray-400 text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {amortizacion.map((fila) => (
                <TableRow 
                  key={fila.nro} 
                  className={`border-gray-800 hover:bg-gray-800/50 ${
                    fila.estado === 'PAGADO' ? 'bg-green-950/20' : 
                    fila.estado === 'EN MORA' ? 'bg-red-950/20' : ''
                  }`}
                >
                  <TableCell className="text-gray-300 font-medium">{fila.nro}</TableCell>
                  <TableCell className="text-gray-300">{fila.fechaVencimiento}</TableCell>
                  <TableCell className="text-gray-300">${fila.monto.toFixed(2)}</TableCell>
                  <TableCell className="text-gray-300">${fila.montoPagado.toFixed(2)}</TableCell>
                  <TableCell className="text-gray-300">${fila.saldo.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={
                      fila.estado === 'PAGADO' ? 'text-green-500 border-green-800 bg-green-950/50' : 
                      fila.estado === 'EN MORA' ? 'text-red-500 border-red-800 bg-red-950/50' : 
                      'text-gray-400 border-gray-700'
                    }>
                      {fila.estado}
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
