'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Trash2, Calendar, FileText, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getClienteById } from '@/lib/supabase/queries/clientes';
import { getCuotasByCliente } from '@/lib/supabase/queries/cuotas';
import { getAbonosByCliente, deleteAbono } from '@/lib/supabase/queries/abonos';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function FichaClientePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [cliente, setCliente] = useState<any>(null);
  const [cuotas, setCuotas] = useState<any[]>([]);
  const [abonos, setAbonos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cData, qData, aData] = await Promise.all([
        getClienteById(id as string),
        getCuotasByCliente(id as string),
        getAbonosByCliente(id as string)
      ]);
      setCliente(cData);
      setCuotas(qData || []);
      setAbonos(aData || []);
    } catch (error) {
      toast.error('Error al cargar la ficha del cliente');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const handleDeleteAbono = async (abonoId: string) => {
    try {
      await deleteAbono(abonoId);
      toast.success('Abono eliminado exitosamente');
      loadData();
    } catch (error) {
      toast.error('Error al eliminar abono');
    }
  };

  if (loading) return <div className="p-6"><Skeleton className="h-screen w-full" /></div>;
  if (!cliente) return <div className="p-6 text-center text-red-500">Cliente no encontrado</div>;

  const totalAbonado = abonos.reduce((sum, acc) => sum + acc.monto, 0);
  const saldoPendiente = cliente.total_moto - totalAbonado;
  const progreso = Math.min(100, Math.max(0, (totalAbonado / cliente.total_moto) * 100));
  const pagadas = cuotas.filter(c => c.estado === 'pagada').length;
  const pendientes = cuotas.length - pagadas;
  const ultimoAbono = abonos.length > 0 ? new Date(abonos[0].fecha).toLocaleDateString('es-VE') : 'Ninguno';

  return (
    <div className="p-6 space-y-6 bg-[var(--rolca-paper-soft)] min-h-screen text-[#17181C] pb-24">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard/clientes')} className="p-0 h-10 w-10">
          <ArrowLeft className="h-6 w-6 text-gray-500" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{cliente.nombre}</h1>
          <p className="text-gray-500">C.I: {cliente.cedula} • Tel: {cliente.telefono || 'N/A'}</p>
        </div>
        <div className="ml-auto">
          <Badge className={`text-sm px-3 py-1 ${cliente.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {cliente.estado.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">Progreso de Pago</span>
          <span className="text-sm font-bold text-gray-700">{progreso.toFixed(1)}%</span>
        </div>
        <Progress value={progreso} className="h-3 bg-gray-100" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm"><CardContent className="p-4"><p className="text-sm text-gray-500">Precio Moto</p><p className="text-xl font-bold">${cliente.total_moto.toFixed(2)}</p></CardContent></Card>
        <Card className="bg-white shadow-sm"><CardContent className="p-4"><p className="text-sm text-gray-500">Total Abonado</p><p className="text-xl font-bold text-green-600">${totalAbonado.toFixed(2)}</p></CardContent></Card>
        <Card className="bg-white shadow-sm"><CardContent className="p-4"><p className="text-sm text-gray-500">Saldo Pendiente</p><p className="text-xl font-bold text-red-600">${saldoPendiente.toFixed(2)}</p></CardContent></Card>
        <Card className="bg-white shadow-sm"><CardContent className="p-4"><p className="text-sm text-gray-500">Cuota Semanal</p><p className="text-xl font-bold">${cliente.monto_cuota.toFixed(2)}</p></CardContent></Card>
        <Card className="bg-white shadow-sm"><CardContent className="p-4"><p className="text-sm text-gray-500">Cuotas Pagadas</p><p className="text-xl font-bold text-blue-600">{pagadas}</p></CardContent></Card>
        <Card className="bg-white shadow-sm"><CardContent className="p-4"><p className="text-sm text-gray-500">Cuotas Pendientes</p><p className="text-xl font-bold text-amber-600">{pendientes}</p></CardContent></Card>
        <Card className="bg-white shadow-sm"><CardContent className="p-4"><p className="text-sm text-gray-500">Último Abono</p><p className="text-xl font-bold">{ultimoAbono}</p></CardContent></Card>
        <Card className="bg-white shadow-sm"><CardContent className="p-4"><p className="text-sm text-gray-500">Moto</p><p className="text-sm font-bold truncate mt-1">{cliente.moto || 'N/A'}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="cuotas" className="w-full">
        <TabsList className="bg-white border-b w-full justify-start rounded-none h-auto p-0 gap-6">
          <TabsTrigger value="cuotas" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-3 pt-2 text-md">Control de Cuotas</TabsTrigger>
          <TabsTrigger value="abonos" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-3 pt-2 text-md">Historial de Abonos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cuotas" className="pt-4">
          <Card className="bg-white shadow-sm">
            <Table>
              <TableHeader><TableRow><TableHead>N°</TableHead><TableHead>Fecha Límite</TableHead><TableHead>Monto</TableHead><TableHead>Pagado</TableHead><TableHead>Saldo</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
              <TableBody>
                {cuotas.map((c) => (
                  <TableRow key={c.id} className={
                    c.estado === 'pagada' ? 'bg-green-50/50' : c.estado === 'atrasada' ? 'bg-red-50/50' : c.estado === 'parcial' ? 'bg-amber-50/50' : ''
                  }>
                    <TableCell className="font-medium">{c.numero_cuota}</TableCell>
                    <TableCell>{new Date(c.fecha_limite).toLocaleDateString('es-VE')}</TableCell>
                    <TableCell>${c.monto_esperado.toFixed(2)}</TableCell>
                    <TableCell>${(c.monto_pagado || 0).toFixed(2)}</TableCell>
                    <TableCell>${((c.monto_esperado) - (c.monto_pagado || 0)).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        ${c.estado === 'pagada' ? 'bg-green-100 text-green-800' : ''}
                        ${c.estado === 'atrasada' ? 'bg-red-100 text-red-800' : ''}
                        ${c.estado === 'parcial' ? 'bg-amber-100 text-amber-800' : ''}
                        ${c.estado === 'pendiente' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>{c.estado.toUpperCase()}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="abonos" className="pt-4">
          <Card className="bg-white shadow-sm">
            <div className="p-4 flex justify-end">
              <Link href={`/dashboard/abonos/registrar?cliente=${cliente.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Registrar Abono
                </Button>
              </Link>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Monto</TableHead><TableHead>Método</TableHead><TableHead>Referencia</TableHead><TableHead>Obs.</TableHead><TableHead>Acciones</TableHead></TableRow></TableHeader>
              <TableBody>
                {abonos.length > 0 ? abonos.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{new Date(a.fecha).toLocaleDateString('es-VE')}</TableCell>
                    <TableCell className="font-bold text-green-600">${a.monto.toFixed(2)}</TableCell>
                    <TableCell className="capitalize">{a.metodo_pago.replace('_', ' ')}</TableCell>
                    <TableCell>{a.referencia || '-'}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{a.observacion || '-'}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar este abono?</AlertDialogTitle>
                            <AlertDialogDescription>Esta acción es irreversible y recalculará las cuotas pagadas.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAbono(a.id)} className="bg-red-600 hover:bg-red-700 text-white">Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">No hay abonos registrados</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-6 right-6 md:hidden">
        <Link href={`/dashboard/abonos/registrar?cliente=${cliente.id}`}>
          <Button size="icon" className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg text-white">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
