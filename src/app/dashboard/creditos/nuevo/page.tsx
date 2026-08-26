'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { NativeSelect } from '@/components/ui/native-select';
import { PageHeader } from '@/components/shared/page-header';
import { calculateFinancing } from '@/lib/calculations';
import { formatMoney } from '@/lib/utils';

export default function NuevoCreditoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Form State
  const [clienteId, setClienteId] = useState('');
  const [motoId, setMotoId] = useState('');
  const [precioMoto, setPrecioMoto] = useState(1200);
  const [inicialPorcentaje, setInicialPorcentaje] = useState(30);
  const [frecuencia, setFrecuencia] = useState('Mensual');
  const [cuotas, setCuotas] = useState(12);

  // Derived values
  const {
    downPayment: montoInicial,
    financedAmount: montoFinanciar,
    installmentAmount: montoCuota,
  } = calculateFinancing(precioMoto, inicialPorcentaje, cuotas);

  const handleConfirm = () => {
    toast.success('Crédito generado exitosamente');
    router.push('/dashboard/creditos');
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-950 text-white min-h-screen">
      <PageHeader title="Nuevo Crédito" backHref="/dashboard/creditos" className="mb-6" />

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <React.Fragment key={i}>
            <div className={`flex flex-col items-center ${step >= i ? 'text-red-500' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 ${step >= i ? 'border-red-500 bg-red-950' : 'border-gray-600 bg-gray-900'}`}>
                {step > i ? <Check className="h-4 w-4" /> : i}
              </div>
              <span className="text-xs font-medium">
                {i === 1 ? 'Cliente' : i === 2 ? 'Moto' : i === 3 ? 'Configurar' : 'Resumen'}
              </span>
            </div>
            {i < 4 && (
              <div className={`flex-1 h-0.5 mx-4 ${step > i ? 'bg-red-500' : 'bg-gray-700'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardContent className="p-6">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-xl font-semibold mb-4">Seleccionar Cliente</h3>
                <div className="space-y-2">
                  <Label>Buscar Cliente</Label>
                  <NativeSelect
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                  >
                    <option value="">Seleccione un cliente...</option>
                    <option value="1">V-12345678 - Carlos Mendoza</option>
                    <option value="3">V-11223344 - José González</option>
                    <option value="6">E-84759234 - Juan García</option>
                  </NativeSelect>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-xl font-semibold mb-4">Seleccionar Moto</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: '1', nombre: 'Bera SBR 150', precio: 1200 },
                    { id: '2', nombre: 'Suzuki GN 125', precio: 1550 },
                    { id: '3', nombre: 'Yamaha FZ 150', precio: 2600 },
                    { id: '4', nombre: 'Honda Navi', precio: 1600 }
                  ].map(moto => (
                    <div 
                      key={moto.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${motoId === moto.id ? 'border-red-500 bg-red-950/20' : 'border-gray-800 hover:border-gray-600 bg-gray-950'}`}
                      onClick={() => {
                        setMotoId(moto.id);
                        setPrecioMoto(moto.precio);
                      }}
                    >
                      <div className="text-2xl mb-2">🏍️</div>
                      <div className="font-semibold">{moto.nombre}</div>
                      <div className="text-red-400 text-sm">Precio Crédito: ${moto.precio}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <h3 className="text-xl font-semibold mb-4">Configurar Condiciones de Crédito</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Precio de la Moto (USD)</Label>
                    <Input disabled value={`$${precioMoto}`} className="bg-gray-950 border-gray-800 text-gray-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Porcentaje de Inicial (%)</Label>
                    <Input 
                      type="number" 
                      min="30" 
                      max="80" 
                      value={inicialPorcentaje} 
                      onChange={(e) => setInicialPorcentaje(Number(e.target.value))}
                      className="bg-gray-950 border-gray-800 text-white" 
                    />
                    <p className="text-xs text-gray-500">Mínimo requerido: 30%</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Monto de Inicial (USD)</Label>
                    <Input disabled value={formatMoney(montoInicial)} className="bg-gray-950 border-gray-800 text-gray-400" />
                  </div>

                  <div className="space-y-2">
                    <Label>Monto a Financiar (USD)</Label>
                    <Input disabled value={formatMoney(montoFinanciar)} className="bg-gray-950 border-gray-800 font-bold text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label>Frecuencia de Pago</Label>
                    <NativeSelect
                      value={frecuencia}
                      onChange={(e) => setFrecuencia(e.target.value)}
                    >
                      <option value="Semanal">Semanal</option>
                      <option value="Quincenal">Quincenal</option>
                      <option value="Mensual">Mensual</option>
                    </NativeSelect>
                  </div>

                  <div className="space-y-2">
                    <Label>Número de Cuotas</Label>
                    <NativeSelect
                      value={cuotas}
                      onChange={(e) => setCuotas(Number(e.target.value))}
                    >
                      <option value="4">4 cuotas</option>
                      <option value="8">8 cuotas</option>
                      <option value="12">12 cuotas</option>
                      <option value="16">16 cuotas</option>
                      <option value="20">20 cuotas</option>
                      <option value="24">24 cuotas</option>
                    </NativeSelect>
                  </div>
                </div>

                <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 mt-4 flex justify-between items-center">
                  <span className="text-gray-400">Monto de cuota calculada:</span>
                  <span className="text-2xl font-bold text-red-500">{formatMoney(montoCuota)}</span>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <h3 className="text-xl font-semibold mb-4">Resumen y Confirmación</h3>
                
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-y-4 border-b border-gray-800 pb-4">
                    <div>
                      <p className="text-sm text-gray-500">Cliente</p>
                      <p className="font-medium">Carlos Mendoza (V-12345678)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Motocicleta</p>
                      <p className="font-medium">Bera SBR 150</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Precio Total</p>
                      <p className="font-medium">{formatMoney(precioMoto)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Inicial Pagada ({inicialPorcentaje}%)</p>
                      <p className="font-medium">{formatMoney(montoInicial)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monto Financiado</p>
                      <p className="font-medium">{formatMoney(montoFinanciar)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Plan de Pago</p>
                      <p className="font-medium">{cuotas} cuotas {frecuencia.toLowerCase()}s de <span className="text-red-400 font-bold">{formatMoney(montoCuota)}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-4 border-t border-gray-800">
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)} 
                disabled={step === 1}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Anterior
              </Button>
              
              {step < 4 ? (
                <Button 
                  onClick={() => setStep(step + 1)} 
                  disabled={(step === 1 && !clienteId) || (step === 2 && !motoId)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleConfirm}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Confirmar Crédito <Check className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
