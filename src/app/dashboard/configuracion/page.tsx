'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function ConfiguracionPage() {
  const handleSave = () => {
    toast.success('Configuración guardada exitosamente');
  };

  return (
    <div className="p-6 space-y-6 bg-[var(--rolca-paper-soft)] min-h-screen text-[#17181C] max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold flex items-center gap-2">⚙️ Configuración del Sistema</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader><CardTitle>Configuración General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tolerancia Global de Atraso (días)</label>
              <Input type="number" defaultValue={0} />
            </div>
            
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="font-medium">Alertas Activas</p>
                <p className="text-sm text-gray-500">Mostrar notificaciones de cobranza</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="font-medium">Integración WhatsApp</p>
                <p className="text-sm text-gray-500">Botón de contacto directo</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="space-y-2 border-t pt-4">
              <label className="text-sm font-medium">Plantilla de Recordatorio (WhatsApp)</label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                defaultValue="Hola {nombre}, te recordamos que tienes una cuota pendiente de ${monto}. Por favor, ponte en contacto con nosotros."
              />
              <p className="text-xs text-gray-500">Variables disponibles: {`{nombre}`}, {`{monto}`}</p>
            </div>

            <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">Guardar Cambios</Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader><CardTitle>Información del Sistema</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Versión de la aplicación</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">v2.0.0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Estado de Base de Datos</span>
              <span className="flex items-center text-green-600 text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Conectado
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Zona Horaria</span>
              <span className="text-sm">America/Caracas (VET)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
