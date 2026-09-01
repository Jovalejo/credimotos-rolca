import * as xlsx from 'xlsx';

export function exportToExcel(data: any[], filename: string, sheetName: string = 'Datos') {
  if (!data || data.length === 0) return;

  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  xlsx.writeFile(workbook, `${filename}.xlsx`);
}

export function exportReporteExcel(data: any[], titulo: string) {
  const fecha = new Date().toISOString().split('T')[0];
  const filename = `${titulo.replace(/\s+/g, '_').toLowerCase()}_${fecha}`;
  
  exportToExcel(data, filename, 'Reporte');
}
