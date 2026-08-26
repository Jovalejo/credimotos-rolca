'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { formatMoney } from '@/lib/utils';
import { DollarSign, TrendingUp, AlertTriangle, Bike, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const barData = [
  { name: 'Ene', total: 4500 },
  { name: 'Feb', total: 5200 },
  { name: 'Mar', total: 6100 },
  { name: 'Abr', total: 5800 },
  { name: 'May', total: 7300 },
  { name: 'Jun', total: 8350 },
];

const areaData = [
  { name: 'Ene', activos: 45 },
  { name: 'Feb', activos: 52 },
  { name: 'Mar', activos: 68 },
  { name: 'Abr', activos: 85 },
  { name: 'May', activos: 102 },
  { name: 'Jun', activos: 125 },
];

const pagosRecientes = [
  { id: 1, fecha: '25/08/2026', cliente: 'Carlos Mendoza', monto: 120.00, metodo: 'Pago Móvil', estado: 'Completado' },
  { id: 2, fecha: '25/08/2026', cliente: 'María Rodríguez', monto: 85.50, metodo: 'Efectivo USD', estado: 'Completado' },
  { id: 3, fecha: '24/08/2026', cliente: 'José González', monto: 200.00, metodo: 'Zelle', estado: 'Pendiente' },
  { id: 4, fecha: '24/08/2026', cliente: 'Ana Silva', monto: 50.00, metodo: 'Pago Móvil', estado: 'Completado' },
  { id: 5, fecha: '23/08/2026', cliente: 'Luis Pérez', monto: 150.00, metodo: 'Binance USDT', estado: 'Completado' },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-gray-950 text-white min-h-screen">
      <PageHeader title="Panel de Control" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Cartera Activa"
          value="$45,600.00"
          icon={DollarSign}
          iconClassName="text-green-500"
          footer={
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUp className="h-3 w-3 mr-1" /> +12% respecto al mes anterior
            </p>
          }
        />
        <StatCard
          title="Cobros del Mes"
          value="$8,350.00"
          icon={TrendingUp}
          iconClassName="text-green-500"
          footer={
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUp className="h-3 w-3 mr-1" /> +8% respecto al mes anterior
            </p>
          }
        />
        <StatCard
          title="Cuotas Vencidas"
          value="12"
          icon={AlertTriangle}
          iconClassName="text-red-500"
          footer={
            <p className="text-xs text-red-500 flex items-center mt-1">
              <ArrowDown className="h-3 w-3 mr-1" /> Requiere atención inmediata
            </p>
          }
        />
        <StatCard
          title="Motos Disponibles"
          value="15"
          icon={Bike}
          iconClassName="text-gray-400"
          footer={
            <p className="text-xs text-gray-400 flex items-center mt-1">
              <Minus className="h-3 w-3 mr-1" /> Inventario actual
            </p>
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Cobros Mensuales</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip cursor={{fill: '#1f2937'}} contentStyle={{backgroundColor: '#111827', border: 'none', color: '#fff'}} />
                <Bar dataKey="total" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Créditos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorActivos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#111827', border: 'none', color: '#fff'}} />
                <Area type="monotone" dataKey="activos" stroke="#DC2626" fillOpacity={1} fill="url(#colorActivos)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Pagos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Fecha</TableHead>
                <TableHead className="text-gray-400">Cliente</TableHead>
                <TableHead className="text-gray-400">Monto</TableHead>
                <TableHead className="text-gray-400">Método</TableHead>
                <TableHead className="text-gray-400">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagosRecientes.map((pago) => (
                <TableRow key={pago.id} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="text-gray-300 font-medium">{pago.fecha}</TableCell>
                  <TableCell className="text-gray-300">{pago.cliente}</TableCell>
                  <TableCell className="text-gray-300">{formatMoney(pago.monto)}</TableCell>
                  <TableCell className="text-gray-300">{pago.metodo}</TableCell>
                  <TableCell>
                    <Badge variant={pago.estado === 'Completado' ? 'default' : 'secondary'} className={pago.estado === 'Completado' ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'}>
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
