'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, AlertTriangle } from 'lucide-react';
import { getCobranzaData } from '@/lib/supabase/queries/cobranza';
import { toast } from 'sonner';

export default function CobranzaPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('atrasados');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const result = await getCobranzaData();
        setData(result || []);
      } catch (error) {
        toast.error('Error al cargar datos de cobranza');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getFilteredData = () => {
    switch (filter) {
      case 'todos': return data;
      case 'atrasados': return data.filter(d => d.dias_atraso > 0);
      case '1-3': return data.filter(d => d.dias_atraso >= 1 && d.dias_atraso <= 3);
      case '4-7': return data.filter(d => d.dias_atraso >= 4 && d.dias_atraso <= 7);
      case '+7': return data.filter(d => d.dias_atraso > 7);
      default: return data;
    }
  };

  const filteredData = getFilteredData().sort((a, b) => b.dias_atraso - a.dias_atraso);
  const totalAtrasado = filteredData.reduce((sum, d) => sum + d.monto_pendiente, 0);

  const openWhatsApp = (telefono: string, nombre: string, monto: number) => {
    if (!telefono) return toast.error('El cliente no tiene teléfono registrado');
    const msg = `Hola ${nombre}, te recordamos que tienes una cuota pendiente de $${monto.toFixed(2)}. Por favor, ponte en contacto con nosotros.`;
    const url = `https://wa.me/58${telefono.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-6 space-y-6 bg-[var(--rolca-paper-soft)] min-h-screen text-[#17181C]">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <h1 className="text-3xl font-bold">Cobranza</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant={filter === 'todos' ? 'default' : 'outline'} onClick={() => setFilter('todos')}>Todos</Button>
        <Button variant={filter === 'atrasados' ? 'destructive' : 'outline'} onClick={() => setFilter('atrasados')}>Atrasados</Button>
        <Button variant={filter === '1-3' ? 'secondary' : 'outline'} onClick={() => setFilter('1-3')}>1-3 días</Button>
        <Button variant={filter === '4-7' ? 'secondary' : 'outline'} onClick={() => setFilter('4-7')}>4-7 días</Button>
        <Button variant={filter === '+7' ? 'secondary' : 'outline'} onClick={() => setFilter('+7')}>+7 días</Button>
      </div>

      <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-red-600 font-medium">Resumen del filtro actual</p>
          <p className="text-xl font-bold text-red-700">{filteredData.length} Clientes atrasados</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-red-600 font-medium">Total Atrasado</p>
          <p className="text-2xl font-bold text-red-700">${totalAtrasado.toFixed(2)}</p>
        </div>
      </div>

      <Card className="bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Cuota N°</TableHead>
              <TableHead>Fecha Límite</TableHead>
              <TableHead>Días Atraso</TableHead>
              <TableHead>Deuda</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-4"><Skeleton className="h-10 w-full" /></TableCell></TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{d.cliente_nombre}</TableCell>
                  <TableCell>{d.telefono || '-'}</TableCell>
                  <TableCell>{d.numero_cuota}</TableCell>
                  <TableCell>{new Date(d.fecha_limite).toLocaleDateString('es-VE')}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`
                      ${d.dias_atraso > 7 ? 'bg-red-100 text-red-800 border-red-200' : ''}
                      ${d.dias_atraso > 3 && d.dias_atraso <= 7 ? 'bg-orange-100 text-orange-800 border-orange-200' : ''}
                      ${d.dias_atraso > 0 && d.dias_atraso <= 3 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                    `}>
                      {d.dias_atraso} días
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-red-600">${d.monto_pendiente.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1"
                      onClick={() => openWhatsApp(d.telefono, d.cliente_nombre, d.monto_pendiente)}
                    >
                      <MessageCircle className="h-4 w-4" /> WA
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No hay registros que coincidan</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
