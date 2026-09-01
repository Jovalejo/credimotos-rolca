'use client';

import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { getClientes, getClienteById } from '@/lib/supabase/queries/clientes';
import { createAbono, checkDuplicateAbono } from '@/lib/supabase/queries/abonos';

export default function RegistrarAbonoWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectId = searchParams.get('cliente');

  const [step, setStep] = useState(1);
  const [clientes, setClientes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    monto: '',
    metodo_pago: 'efectivo',
    referencia: '',
    observacion: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  useEffect(() => {
    if (preselectId) {
      getClienteById(preselectId).then(data => {
        if (data) {
          setSelectedCliente(data);
          setStep(2);
        }
      });
    }
  }, [preselectId]);

  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        getClientes(searchTerm).then(result => setClientes(result.data || []));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, step]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, monto: e.target.value });
  };

  const validateStep3 = () => {
    const monto = parseFloat(formData.monto);
    if (isNaN(monto) || monto <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return false;
    }
    const saldo = selectedCliente.total_moto - (selectedCliente.total_abonado || 0);
    if (monto > saldo) {
      toast.warning('El monto supera el saldo pendiente');
    }
    return true;
  };

  const submitAbono = async (force = false) => {
    try {
      setIsSubmitting(true);
      if (!force) {
        const isDup = await checkDuplicateAbono(
          selectedCliente.id,
          formData.fecha,
          parseFloat(formData.monto),
          formData.referencia
        );
        if (isDup) {
          setDuplicateWarning(true);
          setIsSubmitting(false);
          return;
        }
      }

      await createAbono({
        cliente_id: selectedCliente.id,
        monto: parseFloat(formData.monto),
        fecha: formData.fecha,
        metodo_pago: formData.metodo_pago,
        referencia: formData.referencia,
        observacion: formData.observacion
      });
      
      setStep(5);
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar el abono');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 bg-[var(--rolca-paper-soft)] min-h-screen text-[#17181C]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Registrar Abono</h1>
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {s}
            </div>
          ))}
        </div>
      </div>

      <Card className="bg-white shadow-md">
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">1. Buscar Cliente</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input className="pl-9" placeholder="Buscar por nombre, cédula o teléfono" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="max-h-[400px] overflow-y-auto space-y-2 mt-4">
                {clientes.map(c => (
                  <div key={c.id} onClick={() => { setSelectedCliente(c); handleNext(); }} className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors bg-gray-50">
                    <p className="font-bold">{c.nombre}</p>
                    <p className="text-sm text-gray-600">C.I: {c.cedula} • Saldo: ${(c.total_moto - (c.total_abonado || 0)).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && selectedCliente && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">2. Información del Cliente</h2>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div><p className="text-sm text-gray-500">Cliente</p><p className="font-bold">{selectedCliente.nombre}</p></div>
                <div><p className="text-sm text-gray-500">Cédula</p><p className="font-bold">{selectedCliente.cedula}</p></div>
                <div><p className="text-sm text-gray-500">Saldo Actual</p><p className="font-bold text-red-600">${(selectedCliente.total_moto - (selectedCliente.total_abonado || 0)).toFixed(2)}</p></div>
                <div><p className="text-sm text-gray-500">Cuota Semanal</p><p className="font-bold">${selectedCliente.monto_cuota.toFixed(2)}</p></div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleBack}><ArrowLeft className="mr-2 h-4 w-4"/> Volver</Button>
                <Button onClick={handleNext} className="bg-blue-600 text-white">Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Datos del Abono</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha *</label>
                  <Input type="date" value={formData.fecha} onChange={e => setFormData({...formData, fecha: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monto ($) *</label>
                  <Input type="number" step="0.01" min="0.01" value={formData.monto} onChange={handleMontoChange} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Método de Pago *</label>
                  <select value={formData.metodo_pago} onChange={e => setFormData({...formData, metodo_pago: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="pago_movil">Pago Móvil</option>
                    <option value="zelle">Zelle</option>
                    <option value="binance">Binance</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Referencia</label>
                  <Input value={formData.referencia} onChange={e => setFormData({...formData, referencia: e.target.value})} placeholder="Opcional" />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-sm font-medium">Observación</label>
                  <Input value={formData.observacion} onChange={e => setFormData({...formData, observacion: e.target.value})} placeholder="Notas opcionales..." />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleBack}><ArrowLeft className="mr-2 h-4 w-4"/> Volver</Button>
                <Button onClick={() => { if(validateStep3()) handleNext(); }} className="bg-blue-600 text-white">Revisar <ArrowRight className="ml-2 h-4 w-4"/></Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">4. Confirmación</h2>
              {duplicateWarning && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                    <p className="text-sm text-yellow-700">Parece que ya existe un abono idéntico hoy. ¿Estás seguro de registrarlo nuevamente?</p>
                  </div>
                </div>
              )}
              <div className="bg-blue-50 p-6 rounded-lg space-y-3 border border-blue-100">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Cliente:</span><span className="font-bold">{selectedCliente.nombre}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Monto del Abono:</span><span className="font-bold text-green-600 text-lg">${parseFloat(formData.monto).toFixed(2)}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Método:</span><span className="capitalize font-medium">{formData.metodo_pago.replace('_', ' ')}</span></div>
                <div className="flex justify-between pt-2"><span className="text-gray-600">Fecha:</span><span>{new Date(formData.fecha).toLocaleDateString('es-VE')}</span></div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => { setDuplicateWarning(false); handleBack(); }} disabled={isSubmitting}>
                  <ArrowLeft className="mr-2 h-4 w-4"/> Volver
                </Button>
                <div className="space-x-2">
                  {duplicateWarning ? (
                    <>
                      <Button variant="outline" onClick={() => setDuplicateWarning(false)}>Cancelar</Button>
                      <Button onClick={() => submitAbono(true)} disabled={isSubmitting} className="bg-red-600 text-white hover:bg-red-700">
                        {isSubmitting ? 'Registrando...' : 'Registrar de todas formas'}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => submitAbono(false)} disabled={isSubmitting} className="bg-green-600 text-white hover:bg-green-700">
                      {isSubmitting ? 'Registrando...' : 'Confirmar Abono'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center space-y-6 py-8">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-800">¡Abono Registrado Exitosamente!</h2>
              <p className="text-gray-600">El pago se ha aplicado correctamente al estado de cuenta de {selectedCliente.nombre}.</p>
              <div className="flex justify-center gap-4 mt-8">
                <Button variant="outline" onClick={() => { setStep(1); setSelectedCliente(null); setFormData({...formData, monto: '', referencia: '', observacion: ''}); }}>Registrar otro</Button>
                <Button className="bg-blue-600 text-white" onClick={() => router.push(`/dashboard/clientes/${selectedCliente.id}`)}>Ver ficha del cliente</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
