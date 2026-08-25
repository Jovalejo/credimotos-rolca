'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Edit, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';

const clientSchema = z.object({
  tipoDoc: z.string().min(1),
  cedula: z.string().min(6),
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  telefono: z.string().min(10),
  telefonoAlt: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  direccion: z.string().min(5),
  nombreFiador: z.string().min(2),
  telefonoFiador: z.string().min(10),
});

type ClientForm = z.infer<typeof clientSchema>;

const mockClients = [
  { id: 1, cedula: 'V-12345678', nombre: 'Carlos', apellido: 'Mendoza', telefono: '0414-1234567', creditosActivos: 1, estado: 'Activo' },
  { id: 2, cedula: 'V-87654321', nombre: 'María', apellido: 'Rodríguez', telefono: '0424-7654321', creditosActivos: 0, estado: 'Sin crédito' },
  { id: 3, cedula: 'V-11223344', nombre: 'José', apellido: 'González', telefono: '0412-1122334', creditosActivos: 2, estado: 'Activo' },
  { id: 4, cedula: 'V-44332211', nombre: 'Ana', apellido: 'Silva', telefono: '0416-4433221', creditosActivos: 1, estado: 'Activo' },
  { id: 5, cedula: 'V-99887766', nombre: 'Luis', apellido: 'Pérez', telefono: '0414-9988776', creditosActivos: 0, estado: 'Sin crédito' },
  { id: 6, cedula: 'E-84759234', nombre: 'Juan', apellido: 'García', telefono: '0424-8475923', creditosActivos: 1, estado: 'Activo' },
  { id: 7, cedula: 'V-15673892', nombre: 'Carmen', apellido: 'López', telefono: '0412-1567389', creditosActivos: 0, estado: 'Sin crédito' },
  { id: 8, cedula: 'V-20348576', nombre: 'Pedro', apellido: 'Martínez', telefono: '0414-2034857', creditosActivos: 1, estado: 'Activo' },
];

export default function ClientesPage() {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
    defaultValues: { tipoDoc: 'V' }
  });

  const onSubmit = (data: ClientForm) => {
    const newClient = {
      id: clients.length + 1,
      cedula: `${data.tipoDoc}-${data.cedula}`,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      creditosActivos: 0,
      estado: 'Sin crédito'
    };
    setClients([newClient, ...clients]);
    setOpen(false);
    reset();
    toast.success('Cliente creado exitosamente');
  };

  const filteredClients = clients.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cedula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-gray-950 text-white min-h-screen">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
      </div>

      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Buscar por nombre o cédula..." 
            className="pl-8 bg-gray-900 border-gray-800 text-white w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 space-y-2">
                  <Label>Tipo Doc.</Label>
                  <select {...register('tipoDoc')} className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white">
                    <option value="V">V</option>
                    <option value="E">E</option>
                    <option value="J">J</option>
                    <option value="P">P</option>
                  </select>
                </div>
                <div className="col-span-9 space-y-2">
                  <Label>Número de Cédula</Label>
                  <Input {...register('cedula')} className="bg-gray-950 border-gray-800 text-white" />
                  {errors.cedula && <span className="text-red-500 text-xs">{errors.cedula.message}</span>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input {...register('nombre')} className="bg-gray-950 border-gray-800 text-white" />
                </div>
                <div className="space-y-2">
                  <Label>Apellido</Label>
                  <Input {...register('apellido')} className="bg-gray-950 border-gray-800 text-white" />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input {...register('telefono')} className="bg-gray-950 border-gray-800 text-white" />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono Alternativo (Opcional)</Label>
                  <Input {...register('telefonoAlt')} className="bg-gray-950 border-gray-800 text-white" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Email (Opcional)</Label>
                  <Input type="email" {...register('email')} className="bg-gray-950 border-gray-800 text-white" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Dirección Completa</Label>
                  <Input {...register('direccion')} className="bg-gray-950 border-gray-800 text-white" />
                </div>
              </div>
              
              <div className="border-t border-gray-800 pt-4 mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <h4 className="font-medium text-sm text-gray-300">Datos del Fiador</h4>
                </div>
                <div className="space-y-2">
                  <Label>Nombre del Fiador</Label>
                  <Input {...register('nombreFiador')} className="bg-gray-950 border-gray-800 text-white" />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono del Fiador</Label>
                  <Input {...register('telefonoFiador')} className="bg-gray-950 border-gray-800 text-white" />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="button" variant="outline" className="mr-2 border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                  Guardar Cliente
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-gray-800 rounded-md">
        <Table>
          <TableHeader className="bg-gray-900/50">
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead className="text-gray-400">Cédula</TableHead>
              <TableHead className="text-gray-400">Nombre Completo</TableHead>
              <TableHead className="text-gray-400">Teléfono</TableHead>
              <TableHead className="text-gray-400 text-center">Créditos Activos</TableHead>
              <TableHead className="text-gray-400">Estado</TableHead>
              <TableHead className="text-gray-400 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((cliente) => (
              <TableRow key={cliente.id} className="border-gray-800 hover:bg-gray-800/50">
                <TableCell className="text-gray-300 font-medium">{cliente.cedula}</TableCell>
                <TableCell className="text-gray-300">{cliente.nombre} {cliente.apellido}</TableCell>
                <TableCell className="text-gray-300">{cliente.telefono}</TableCell>
                <TableCell className="text-gray-300 text-center">{cliente.creditosActivos}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cliente.estado === 'Activo' ? 'bg-green-950 text-green-400 border-green-800' : 'bg-gray-800 text-gray-400 border-gray-700'}>
                    {cliente.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-white hover:bg-gray-800">
                      <Link href={`/dashboard/clientes/${cliente.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                  No se encontraron clientes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
