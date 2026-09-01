import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClienteConResumen, Cuota, Abono } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';

export function exportReportePDF(data: any[], titulo: string, columnas: string[], fecha: string) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text('CREDIMOTOS ROLCA', 14, 20);
  doc.setFontSize(14);
  doc.text(titulo, 14, 30);
  doc.setFontSize(10);
  doc.text(`Fecha: ${fecha}`, 14, 40);
  
  // Extraer valores de las filas según las columnas
  const body = data.map(row => {
    return Object.values(row).map(v => String(v ?? ''));
  });

  autoTable(doc, {
    startY: 45,
    head: [columnas],
    body: body as string[][],
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59] }, // slate-800
    styles: { fontSize: 9 },
  });
  
  doc.save(`${titulo.replace(/\s+/g, '_').toLowerCase()}_${fecha}.pdf`);
}

export function exportFichaClientePDF(cliente: ClienteConResumen, cuotas: Cuota[], abonos: Abono[]) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Ficha de Cliente - CREDIMOTOS ROLCA', 14, 20);
  
  // Cliente Info
  doc.setFontSize(12);
  doc.text(`Nombre: ${cliente.nombre}`, 14, 35);
  doc.text(`Cédula: ${cliente.cedula}`, 14, 42);
  doc.text(`Teléfono: ${cliente.telefono || 'N/A'}`, 14, 49);
  doc.text(`Moto: ${cliente.moto || 'N/A'}`, 14, 56);
  
  // Financial Summary
  doc.text(`Total Moto: ${formatCurrency(cliente.total_moto || 0)}`, 110, 35);
  doc.text(`Abonado: ${formatCurrency(cliente.total_abonado)}`, 110, 42);
  doc.text(`Saldo: ${formatCurrency(cliente.saldo_pendiente)}`, 110, 49);
  doc.text(`Estado: ${cliente.estado.toUpperCase()}`, 110, 56);
  
  // Cuotas Table
  doc.setFontSize(14);
  doc.text('Plan de Pagos', 14, 75);
  
  const cuotasBody = cuotas.map(c => [
    c.numero_cuota.toString(),
    formatDate(c.fecha_limite),
    formatCurrency(c.monto_cuota),
    formatCurrency(c.monto_pagado),
    formatCurrency(c.saldo_cuota),
    c.estado.toUpperCase()
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Nº', 'Vencimiento', 'Monto', 'Pagado', 'Saldo', 'Estado']],
    body: cuotasBody,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59] },
    styles: { fontSize: 8 },
  });
  
  // Abonos Table
  const finalY = (doc as any).lastAutoTable.finalY || 80;
  
  doc.setFontSize(14);
  doc.text('Historial de Pagos', 14, finalY + 15);
  
  const abonosBody = abonos.map(a => [
    formatDate(a.fecha),
    formatCurrency(a.monto),
    a.metodo_pago.toUpperCase(),
    a.referencia || 'N/A'
  ]);

  autoTable(doc, {
    startY: finalY + 20,
    head: [['Fecha', 'Monto', 'Método', 'Referencia']],
    body: abonosBody,
    theme: 'grid',
    headStyles: { fillColor: [22, 163, 74] }, // green-600
    styles: { fontSize: 8 },
  });
  
  doc.save(`cliente_${cliente.cedula}_${new Date().toISOString().split('T')[0]}.pdf`);
}
