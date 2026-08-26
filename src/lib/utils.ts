import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUSD(amount: number): string {
  assertFiniteAmount(amount)

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatVES(amount: number): string {
  assertFiniteAmount(amount)

  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
  }).format(amount)
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date)
  return format(d, "dd 'de' MMMM, yyyy", { locale: es })
}

export function formatShortDate(date: Date | string | number): string {
  const d = new Date(date)
  return format(d, 'dd/MM/yyyy', { locale: es })
}

function assertFiniteAmount(amount: number): void {
  if (!Number.isFinite(amount)) {
    throw new RangeError('Currency amount must be a finite number')
  }
}
