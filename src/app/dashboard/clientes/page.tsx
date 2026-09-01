'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { getClientes, createCliente } from '@/lib/supabase/queries/clientes';
import { generarCuotas } from '@/lib/supabase/queries/cuotas';

const clientSchema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  cedula: z.string().min(1, 'Requerido'),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  moto: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  anio: z.string().optional(),
  total_moto: z.coerce.number().min(0.01, 'Debe ser mayor a 0'),
  cantidad_cuotas: z.coerce.number().min(1, 'Mínimo 1 cuota'),
  monto_cuota: z.coerce.number().min(0.01, 'Debe ser mayor a 0'),
  fecha_inicio: z.string().min(1, 'Requerido'),
  dia_pago: z.coerce.number().min(0).max(6),
  tolerancia_dias: z.coerce.number().min(0).default(0),
  observaciones: z.string().optional(),
});

type ClientForm = z.infer<typeof clientSchema>;

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      dia_pago: 1,
      tolerancia_dias: 0,
      total_moto: 0,
      cantidad_cuotas: 1,
      monto_cuota: 0
    }
  });

  const fetchClientes = async (search = '') => {
    try {
      setLoading(true);
      const result = await getClientes(search);
      setClientes(result.data || []);
    } catch (error) {
      toast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchClientes(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const onSubmit = async (data: ClientForm) => {
    try {
      setIsSubmitting(true);
      const clienteData = {
        ...data,
        anio: data.anio ? Number(data.anio) : undefined,
        total_moto: Number(data.total_moto),
        cantidad_cuotas: Number(data.cantidad_cuotas),
        monto_cuota: Number(data.monto_cuota),
        dia_pago: Number(data.dia_pago),
        tolerancia_dias: Number(data.tolerancia_dias || 0),
      };
      const newCliente = await createCliente(clienteData);
      if (newCliente?.id) {
        await generarCuotas(newCliente.id, Number(data.cantidad_cuotas), Number(data.monto_cuota), data.fecha_inicio, Number(data.dia_pago));
        toast.success('Cliente y cuotas generados exitosamente');
        setIsDialogOpen(false);
        reset();
        fetchClientes(searchTerm);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al crear cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'activo': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>;
      case 'en_mora': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">En Mora</Badge>;
      case 'pagado': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pagado</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 capitalize">{estado}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[var(--rolca-paper-soft)] min-h-screen text-[#17181C]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre Completo *</label>
                  <Input {...register('nombre')} placeholder="Ej. Juan Pérez" />
                  {errors.nombre && <span className="text-xs text-red-500">{errors.nombre.message}</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cédula *</label>
                  <Input {...register('cedula')} placeholder="Ej. V-12345678" />
                  {errors.cedula && <span className="text-xs text-red-500">{errors.cedula.message}</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input {...register('telefono')} placeholder="Ej. 0414-1234567" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dirección</label>
                  <Input {...register('direccion')} placeholder="Ej. Centro, Calle 1" />
                </div>
                
                <div className="col-span-full border-t pt-4 mt-2">
                  <h3 className="font-medium text-gray-700 mb-4">Datos del Financiamiento</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Moto / Descripción</label>
                  <Input {...register('moto')} placeholder="Ej. Bera SBR 2024" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Precio Total ($) *</label>
                  <Input type="number" step="0.01" {...register('total_moto')} />
                  {errors.total_moto && <span className="text-xs text-red-500">{errors.total_moto.message}</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cantidad de Cuotas *</label>
                  <Input type="number" {...register('cantidad_cuotas')} />
                  {errors.cantidad_cuotas && <span className="text-xs text-red-500">{errors.cantidad_cuotas.message}</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monto por Cuota ($) *</label>
                  <Input type="number" step="0.01" {...register('monto_cuota')} />
                  {errors.monto_cuota && <span className="text-xs text-red-500">{errors.monto_cuota.message}</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha de Inicio *</label>
                  <Input type="date" {...register('fecha_inicio')} />
                  {errors.fecha_inicio && <span className="text-xs text-red-500">{errors.fecha_inicio.message}</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Día de Pago Semanal</label>
                  <select {...register('dia_pago')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="0">Domingo</option>
                    <option value="1">Lunes</option>
                    <option value="2">Martes</option>
                    <option value="3">Miércoles</option>
                    <option value="4">Jueves</option>
                    <option value="5">Viernes</option>
                    <option value="6">Sábado</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium">Observaciones</label>
                <textarea {...register('observaciones')} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" placeholder="Notas adicionales..." />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-4 max-w-sm">
            <Search className="h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar por nombre, cédula o teléfono..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-gray-200"
            />
          </div>

          <div className="rounded-md border border-gray-100 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Cédula</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Moto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : clientes.length > 0 ? (
                  clientes.map((cliente) => (
                    <TableRow key={cliente.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium">{cliente.cedula}</TableCell>
                      <TableCell>{cliente.nombre}</TableCell>
                      <TableCell>{cliente.telefono || '-'}</TableCell>
                      <TableCell>{cliente.moto || '-'}</TableCell>
                      <TableCell>{getStatusBadge(cliente.estado)}</TableCell>
                      <TableCell>${(cliente.total_moto - (cliente.total_abonado || 0)).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/clientes/${cliente.id}`}>
                          <Button variant="ghost" size="icon" className="hover:bg-gray-100 text-gray-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
