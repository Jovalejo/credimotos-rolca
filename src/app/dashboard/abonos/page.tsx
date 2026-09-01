'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { getAbonos } from '@/lib/supabase/queries/abonos';
import { toast } from 'sonner';

export default function HistorialAbonosPage() {
  const [abonos, setAbonos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [metodoPago, setMetodoPago] = useState('todos');

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getAbonos({ 
        fechaDesde: fechaDesde || undefined, 
        fechaHasta: fechaHasta || undefined, 
        metodoPago: metodoPago === 'todos' ? undefined : metodoPago 
      });
      setAbonos(result.data || []);
    } catch (error) {
      toast.error('Error al cargar abonos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [fechaDesde, fechaHasta, metodoPago]);

  const total = abonos.reduce((sum, a) => sum + a.monto, 0);
  const promedio = abonos.length > 0 ? total / abonos.length : 0;

  return (
    <div className="p-6 space-y-6 bg-[var(--rolca-paper-soft)] min-h-screen text-[#17181C]">
      <h1 className="text-3xl font-bold">Historial de Abonos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Desde</label>
          <Input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Hasta</label>
          <Input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Método de Pago</label>
          <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="todos">Todos</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="pago_movil">Pago Móvil</option>
            <option value="zelle">Zelle</option>
            <option value="binance">Binance</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total del Período</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-green-600">${total.toFixed(2)}</p></CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Cantidad de Abonos</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{abonos.length}</p></CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Promedio por Abono</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-blue-600">${promedio.toFixed(2)}</p></CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Referencia</TableHead>
              <TableHead>Observación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-4"><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            ) : abonos.length > 0 ? (
              abonos.map((a) => (
                <TableRow key={a.id} className="hover:bg-gray-50/50">
                  <TableCell>{new Date(a.fecha).toLocaleDateString('es-VE')}</TableCell>
                  <TableCell className="font-medium">{a.cliente_nombre}</TableCell>
                  <TableCell className="font-bold text-green-600">${a.monto.toFixed(2)}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{a.metodo_pago.replace('_', ' ')}</Badge></TableCell>
                  <TableCell>{a.referencia || '-'}</TableCell>
                  <TableCell className="text-gray-500 text-sm max-w-xs truncate">{a.observacion || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No hay abonos en este período</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
