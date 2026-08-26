/**
 * Shared Tailwind class helpers for status badges used across the dashboard.
 */

export function creditStatusBadgeClass(estado: string): string {
  switch (estado) {
    case 'ACTIVO':
      return 'bg-green-600 hover:bg-green-700';
    case 'COMPLETADO':
      return 'bg-blue-600 hover:bg-blue-700';
    default:
      return 'bg-red-600 hover:bg-red-700';
  }
}

export function motoStatusBadgeClass(estado: string): string {
  switch (estado) {
    case 'DISPONIBLE':
      return 'bg-green-600 hover:bg-green-700';
    case 'RESERVADA':
      return 'bg-yellow-600 hover:bg-yellow-700';
    default:
      return 'bg-red-600 hover:bg-red-700';
  }
}

export function cuotaStatusBadgeClass(estado: string): string {
  switch (estado) {
    case 'PAGADO':
      return 'text-green-500 border-green-800 bg-green-950/50';
    case 'EN MORA':
      return 'text-red-500 border-red-800 bg-red-950/50';
    default:
      return 'text-gray-400 border-gray-700';
  }
}

export function cuotaRowClass(estado: string): string {
  switch (estado) {
    case 'PAGADO':
      return 'bg-green-950/20';
    case 'EN MORA':
      return 'bg-red-950/20';
    default:
      return '';
  }
}
