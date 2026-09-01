export interface Cliente {
  id: string;
  nombre: string;
  cedula: string;
  telefono: string | null;
  direccion: string | null;
  moto: string | null;
  marca: string | null;
  modelo: string | null;
  anio: number | null;
  total_moto: number | null;
  cantidad_cuotas: number | null;
  monto_cuota: number | null;
  fecha_inicio: string | null;
  dia_pago: number;
  tolerancia_dias: number;
  estado: 'activo' | 'en_mora' | 'pagado' | 'cancelado';
  observaciones: string | null;
  created_at: string;
  updated_at: string;
}

export interface Cuota {
  id: string;
  cliente_id: string;
  numero_cuota: number;
  fecha_limite: string;
  monto_cuota: number;
  monto_pagado: number;
  saldo_cuota: number;
  estado: 'pendiente' | 'pagada' | 'parcial' | 'atrasada';
  dias_atraso: number;
  created_at: string;
  updated_at: string;
}

export interface Abono {
  id: string;
  cliente_id: string;
  fecha: string;
  monto: number;
  metodo_pago: 'efectivo' | 'transferencia' | 'pago_movil' | 'zelle' | 'binance' | 'otro';
  referencia: string | null;
  observacion: string | null;
  created_at: string;
  updated_at: string;
}

export interface AbonoCuota {
  id: string;
  abono_id: string;
  cuota_id: string;
  monto_aplicado: number;
  created_at: string;
}

export interface Configuracion {
  id: string;
  tolerancia_global_dias: number;
  alertas_activas: boolean;
  whatsapp_activo: boolean;
  mensaje_recordatorio: string;
  created_at: string;
  updated_at: string;
}

export interface ClienteConResumen extends Cliente {
  total_abonado: number;
  saldo_pendiente: number;
  cuotas_pagadas: number;
  cuotas_pendientes: number;
  cuotas_atrasadas: number;
}

export interface AbonoConCliente extends Abono {
  clientes: Cliente;
}

export interface CuotaConCliente extends Cuota {
  clientes: Cliente;
}

export interface DashboardStats {
  clientes_activos: number;
  clientes_mora: number;
  total_cobrado_mes: number;
  total_pendiente_mes: number;
  cuotas_atrasadas_total: number;
}

export interface ReporteDiario {
  fecha: string;
  total_recaudado: number;
  cantidad_abonos: number;
  abonos: AbonoConCliente[];
}
