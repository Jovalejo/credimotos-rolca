'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileDown } from 'lucide-react';
import { getReporteDiario } from '@/lib/supabase/queries/reportes';
import { toast } from 'sonner';

export default function ReporteDiarioPage() {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getReporteDiario(fecha);
        setData(res);
      } catch (error) {
        toast.error('Error al cargar reporte');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fecha]);

  return (
    <div className="p-6 space-y-6 bg-[var(--rolca-paper-soft)] min-h-screen text-[#17181C]">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">📅 Reporte Diario</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2 text-green-700 hover:text-green-800 hover:bg-green-50 border-green-200">
            <FileDown className="h-4 w-4" /> Excel
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 w-fit">
        <label className="font-medium text-gray-700">Seleccionar Fecha:</label>
        <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-auto" />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Recaudado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">${data?.total_recaudado?.toFixed(2) || '0.00'}</p></CardContent></Card>
            <Card className="bg-white shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Cantidad Abonos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data?.cantidad_abonos || 0}</p></CardContent></Card>
            <Card className="bg-white shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Clientes Únicos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{data?.clientes_unicos || 0}</p></CardContent></Card>
            <Card className="bg-white shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Promedio/Cliente</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">${data?.promedio_cliente?.toFixed(2) || '0.00'}</p></CardContent></Card>
          </div>

          <Card className="bg-white shadow-sm mt-6">
            <Table>
              <TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Monto</TableHead><TableHead>Método</TableHead><TableHead>Referencia</TableHead></TableRow></TableHeader>
              <TableBody>
                {data?.abonos?.length > 0 ? data.abonos.map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.cliente_nombre}</TableCell>
                    <TableCell className="font-bold text-green-600">${a.monto.toFixed(2)}</TableCell>
                    <TableCell className="capitalize">{a.metodo_pago.replace('_', ' ')}</TableCell>
                    <TableCell>{a.referencia || '-'}</TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={4} className="text-center py-6 text-gray-500">No hay movimientos para esta fecha</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
}
