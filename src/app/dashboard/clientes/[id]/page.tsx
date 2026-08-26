'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Phone, MapPin, Mail, FileText } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { creditStatusBadgeClass } from '@/lib/status-badges';
import { formatMoney } from '@/lib/utils';

// Mock data
const clientData = {
  id: 1,
  cedula: 'V-12345678',
  nombre: 'Carlos',
  apellido: 'Mendoza',
  telefono: '0414-1234567',
  telefonoAlt: '0212-9876543',
  email: 'carlos.mendoza@email.com',
  direccion: 'Av. Principal, Edificio El Parque, Apto 4B, Caracas',
  fechaRegistro: '15/01/2026',
  estado: 'Activo',
  fiador: {
    nombre: 'Roberto Mendoza',
    telefono: '0412-5556677',
    cedula: 'V-9876543'
  }
};

const creditosData = [
  { id: 'CRD-1024', moto: 'Bera SBR 150', monto: 1200, cuota: 150, cuotasPagadas: 4, cuotasTotal: 8, estado: 'ACTIVO' },
  { id: 'CRD-0850', moto: 'Empire EK Express', monto: 950, cuota: 237.5, cuotasPagadas: 4, cuotasTotal: 4, estado: 'COMPLETADO' }
];

const pagosData = [
  { id: 'REC-5021', fecha: '25/08/2026', credito: 'CRD-1024', monto: 150.00, metodo: 'Pago Móvil', estado: 'Completado' },
  { id: 'REC-4890', fecha: '25/07/2026', credito: 'CRD-1024', monto: 150.00, metodo: 'Efectivo USD', estado: 'Completado' },
  { id: 'REC-4750', fecha: '25/06/2026', credito: 'CRD-1024', monto: 150.00, metodo: 'Zelle', estado: 'Completado' },
  { id: 'REC-4610', fecha: '25/05/2026', credito: 'CRD-1024', monto: 150.00, metodo: 'Transferencia', estado: 'Completado' },
];

export default function ClienteDetallePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-gray-950 text-white min-h-screen">
      <PageHeader
        title={`${clientData.nombre} ${clientData.apellido}`}
        backHref="/dashboard/clientes"
        subtitle={`${clientData.cedula} • Registrado el ${clientData.fechaRegistro}`}
        className="mb-6"
        actions={<Badge className="ml-auto bg-green-600 hover:bg-green-700">{clientData.estado}</Badge>}
      />

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="bg-gray-900 border border-gray-800">
          <TabsTrigger value="info" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">Información Personal</TabsTrigger>
          <TabsTrigger value="creditos" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">Créditos</TabsTrigger>
          <TabsTrigger value="pagos" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">Pagos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><User className="mr-2 h-5 w-5 text-gray-400"/> Datos del Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Cédula</p>
                    <p className="font-medium">{clientData.cedula}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Nombre Completo</p>
                    <p className="font-medium">{clientData.nombre} {clientData.apellido}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 flex items-center"><Phone className="mr-1 h-3 w-3"/> Teléfono Principal</p>
                    <p className="font-medium">{clientData.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 flex items-center"><Phone className="mr-1 h-3 w-3"/> Teléfono Alternativo</p>
                    <p className="font-medium">{clientData.telefonoAlt}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-400 flex items-center"><Mail className="mr-1 h-3 w-3"/> Correo Electrónico</p>
                    <p className="font-medium">{clientData.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-400 flex items-center"><MapPin className="mr-1 h-3 w-3"/> Dirección</p>
                    <p className="font-medium">{clientData.direccion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><FileText className="mr-2 h-5 w-5 text-gray-400"/> Datos del Fiador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Nombre Completo</p>
                    <p className="font-medium">{clientData.fiador.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Cédula</p>
                    <p className="font-medium">{clientData.fiador.cedula}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 flex items-center"><Phone className="mr-1 h-3 w-3"/> Teléfono</p>
                    <p className="font-medium">{clientData.fiador.telefono}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="creditos">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Historial de Créditos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-400">N° Crédito</TableHead>
                    <TableHead className="text-gray-400">Motocicleta</TableHead>
                    <TableHead className="text-gray-400">Monto Financiado</TableHead>
                    <TableHead className="text-gray-400">Progreso</TableHead>
                    <TableHead className="text-gray-400">Estado</TableHead>
                    <TableHead className="text-gray-400 text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditosData.map((credito) => (
                    <TableRow key={credito.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell className="text-gray-300 font-medium">{credito.id}</TableCell>
                      <TableCell className="text-gray-300">{credito.moto}</TableCell>
                      <TableCell className="text-gray-300">{formatMoney(credito.monto)}</TableCell>
                      <TableCell className="text-gray-300">
                        {credito.cuotasPagadas} de {credito.cuotasTotal} cuotas
                      </TableCell>
                      <TableCell>
                        <Badge className={creditStatusBadgeClass(credito.estado)}>
                          {credito.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild className="text-blue-400 hover:text-blue-300">
                          <Link href={`/dashboard/creditos/${credito.id}`}>Ver Detalle</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pagos">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Historial de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-400">N° Recibo</TableHead>
                    <TableHead className="text-gray-400">Fecha</TableHead>
                    <TableHead className="text-gray-400">Crédito</TableHead>
                    <TableHead className="text-gray-400">Monto</TableHead>
                    <TableHead className="text-gray-400">Método</TableHead>
                    <TableHead className="text-gray-400">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagosData.map((pago) => (
                    <TableRow key={pago.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell className="text-gray-300 font-medium">{pago.id}</TableCell>
                      <TableCell className="text-gray-300">{pago.fecha}</TableCell>
                      <TableCell className="text-gray-300">{pago.credito}</TableCell>
                      <TableCell className="text-gray-300">{formatMoney(pago.monto)}</TableCell>
                      <TableCell className="text-gray-300">{pago.metodo}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-950 text-green-400 border-green-800">
                          {pago.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
