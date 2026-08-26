'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CreditCard, DollarSign } from 'lucide-react';
import { NativeSelect } from '@/components/ui/native-select';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { cuotaStatusBadgeClass, cuotaRowClass } from '@/lib/status-badges';
import { formatMoney } from '@/lib/utils';

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
      <PageHeader
        title={`Crédito ${creditDetail.id}`}
        backHref="/dashboard/creditos"
        subtitle={`${creditDetail.cliente} • ${creditDetail.moto}`}
        className="mb-6"
        actions={<Badge className="ml-auto bg-green-600">{creditDetail.estado}</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <StatCard title="Monto Financiado" titleClassName="text-gray-400" value={formatMoney(creditDetail.montoFinanciado)} />
        <StatCard title={`Cuota ${creditDetail.frecuencia}`} titleClassName="text-gray-400" value={formatMoney(creditDetail.cuota)} />
        <StatCard title="Saldo Restante" titleClassName="text-gray-400" value={formatMoney(creditDetail.montoFinanciado - (4 * 70))} />
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
                    <NativeSelect
                      value={selectedCuota}
                      onChange={(e) => setSelectedCuota(e.target.value)}
                    >
                      {amortizacion.filter(a => a.estado !== 'PAGADO').map(a => (
                        <option key={a.nro} value={a.nro}>Cuota {a.nro} - {formatMoney(a.monto)} ({a.estado})</option>
                      ))}
                    </NativeSelect>
                  </div>
                  <div className="space-y-2">
                    <Label>Monto (USD)</Label>
                    <Input defaultValue="70.00" className="bg-gray-950 border-gray-800 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>Método de Pago</Label>
                    <NativeSelect>
                      <option>Pago Móvil</option>
                      <option>Efectivo USD</option>
                      <option>Zelle</option>
                      <option>Binance USDT</option>
                      <option>Punto de Venta</option>
                    </NativeSelect>
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
                  className={`border-gray-800 hover:bg-gray-800/50 ${cuotaRowClass(fila.estado)}`}
                >
                  <TableCell className="text-gray-300 font-medium">{fila.nro}</TableCell>
                  <TableCell className="text-gray-300">{fila.fechaVencimiento}</TableCell>
                  <TableCell className="text-gray-300">{formatMoney(fila.monto)}</TableCell>
                  <TableCell className="text-gray-300">{formatMoney(fila.montoPagado)}</TableCell>
                  <TableCell className="text-gray-300">{formatMoney(fila.saldo)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={cuotaStatusBadgeClass(fila.estado)}>
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
