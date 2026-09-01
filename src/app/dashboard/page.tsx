'use client';

import React, { useEffect, useState } from 'react';
import { Users, DollarSign, AlertTriangle, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { getDashboardStats } from '@/lib/supabase/queries/reportes';
import { getAbonos } from '@/lib/supabase/queries/abonos';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsData, abonosResult] = await Promise.all([
          getDashboardStats(),
          getAbonos({}, 1, 5)
        ]);
        setStats(statsData);
        setRecentPayments(abonosResult.data || []);
      } catch (error) {
        toast.error('Error al cargar los datos del dashboard');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-[var(--rolca-paper-soft)] min-h-screen">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-16 w-full mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full mt-8" />
      </div>
    );
  }

  const hasAtrasadas = stats?.cuotasAtrasadas > 0;

  return (
    <div className="p-6 space-y-6 bg-[var(--rolca-paper-soft)] min-h-screen text-[#17181C]">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        🏍️ Dashboard
      </h1>

      {hasAtrasadas ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm flex justify-between items-center">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-700 font-medium">
              🚨 Tienes {stats.clientesAtrasados} clientes con cuotas atrasadas. Monto atrasado: ${stats.montoAtrasado?.toFixed(2)}
            </p>
          </div>
          <Link href="/dashboard/cobranza">
            <Button variant="destructive" size="sm">Ver Cobranza</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-sm">
          <p className="text-green-700 font-medium">🟢 Todo al día</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClientes || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Abonaron Hoy</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.clientesAbonaronHoy || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Recaudado Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.recaudadoHoy?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Abonos Hoy</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.cantidadAbonosHoy || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Cuotas Atrasadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.cuotasAtrasadas || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Monto Atrasado</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${stats?.montoAtrasado?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-100 col-span-2 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Saldo Pendiente Total</CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">${stats?.saldoPendienteTotal?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm border-gray-100">
        <CardHeader>
          <CardTitle>Últimos Abonos Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Referencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPayments.length > 0 ? (
                recentPayments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{new Date(p.fecha).toLocaleDateString('es-VE')}</TableCell>
                    <TableCell className="font-medium">{p.cliente_nombre}</TableCell>
                    <TableCell>${p.monto.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{p.metodo_pago.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">{p.referencia || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No hay abonos recientes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
