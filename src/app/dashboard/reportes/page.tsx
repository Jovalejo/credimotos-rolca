'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ReportesPage() {
  return (
    <div className="p-6 space-y-6 bg-[var(--rolca-paper-soft)] min-h-screen text-[#17181C]">
      <h1 className="text-3xl font-bold">📊 Reportes y Estadísticas</h1>

      <Tabs defaultValue="semanal" className="w-full">
        <TabsList className="bg-white border rounded-md p-1 mb-6">
          <TabsTrigger value="semanal">Semanal</TabsTrigger>
          <TabsTrigger value="mensual">Mensual</TabsTrigger>
          <TabsTrigger value="personalizado">Personalizado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="semanal">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8 text-center text-gray-500">
              <p>Módulo de reporte semanal en desarrollo.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mensual">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8 text-center text-gray-500">
              <p>Módulo de reporte mensual en desarrollo.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="personalizado">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8 text-center text-gray-500">
              <p>Módulo de reporte personalizado en desarrollo.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
