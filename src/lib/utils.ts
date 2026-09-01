import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  // Ajuste para evitar problemas de zona horaria
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatDateShort(date: string | Date): string {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit'
  });
}

export function getPaymentMethodLabel(method: string): string {
  const methods: Record<string, string> = {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia',
    pago_movil: 'Pago Móvil',
    zelle: 'Zelle',
    binance: 'Binance',
    otro: 'Otro'
  };
  return methods[method] || method;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    activo: 'text-success bg-success/10',
    en_mora: 'text-destructive bg-destructive/10',
    pagado: 'text-success bg-success/10',
    cancelado: 'text-muted-foreground bg-muted',
    pendiente: 'text-warning bg-warning/10',
    pagada: 'text-success bg-success/10',
    parcial: 'text-warning bg-warning/10',
    atrasada: 'text-destructive bg-destructive/10',
  };
  return colors[status] || 'text-primary bg-primary/10';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    activo: 'Activo',
    en_mora: 'En Mora',
    pagado: 'Pagado',
    cancelado: 'Cancelado',
    pendiente: 'Pendiente',
    pagada: 'Pagada',
    parcial: 'Parcial',
    atrasada: 'Atrasada',
  };
  return labels[status] || status;
}

export function getDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  due.setMinutes(due.getMinutes() + due.getTimezoneOffset());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (today <= due) return 0;
  
  const diffTime = Math.abs(today.getTime() - due.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
