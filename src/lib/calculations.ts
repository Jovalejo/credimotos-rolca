import { Cuota, Abono, AbonoCuota } from '../types/database';

export function generarCuotasSemanales(
  clienteId: string,
  cantidadCuotas: number,
  montoCuota: number,
  fechaInicio: string,
  diaPago: number
): Partial<Cuota>[] {
  const cuotas: Partial<Cuota>[] = [];
  let currentDate = new Date(fechaInicio);
  // Ajuste de zona horaria local
  currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset());

  // Encontrar la próxima fecha que coincida con diaPago (0 = Dom, 1 = Lun, etc.)
  while (currentDate.getDay() !== diaPago) {
    currentDate.setDate(currentDate.getDate() + 1);
  }

  for (let i = 1; i <= cantidadCuotas; i++) {
    cuotas.push({
      cliente_id: clienteId,
      numero_cuota: i,
      fecha_limite: currentDate.toISOString().split('T')[0],
      monto_cuota: montoCuota,
      monto_pagado: 0,
      saldo_cuota: montoCuota,
      estado: 'pendiente',
      dias_atraso: 0,
    });
    // Sumar 7 días para la próxima semana
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return cuotas;
}

export function aplicarAbonoACuotas(
  abono: { id: string; monto: number },
  cuotasPendientes: Cuota[]
): { cuotasActualizadas: Cuota[]; abonosCuotas: Partial<AbonoCuota>[] } {
  let montoRestante = abono.monto;
  const cuotasActualizadas: Cuota[] = [];
  const abonosCuotas: Partial<AbonoCuota>[] = [];

  // Ordenar las cuotas por número (las más antiguas primero)
  const cuotasOrdenadas = [...cuotasPendientes].sort((a, b) => a.numero_cuota - b.numero_cuota);

  for (const cuota of cuotasOrdenadas) {
    if (montoRestante <= 0) break;

    const montoParaAplicar = Math.min(montoRestante, cuota.saldo_cuota);
    
    if (montoParaAplicar > 0) {
      const nuevoMontoPagado = Number(cuota.monto_pagado) + montoParaAplicar;
      const nuevoSaldo = Number(cuota.monto_cuota) - nuevoMontoPagado;
      
      const cuotaActualizada: Cuota = {
        ...cuota,
        monto_pagado: nuevoMontoPagado,
        saldo_cuota: nuevoSaldo,
        estado: nuevoSaldo <= 0 ? 'pagada' : 'parcial',
      };

      if (cuotaActualizada.estado === 'pagada') {
        cuotaActualizada.dias_atraso = 0;
      }

      cuotasActualizadas.push(cuotaActualizada);
      
      abonosCuotas.push({
        abono_id: abono.id,
        cuota_id: cuota.id,
        monto_aplicado: montoParaAplicar,
      });

      montoRestante -= montoParaAplicar;
    }
  }

  return { cuotasActualizadas, abonosCuotas };
}

export function calcularDiasAtraso(fechaLimite: string, toleranciaDias: number): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const limite = new Date(fechaLimite);
  limite.setMinutes(limite.getMinutes() + limite.getTimezoneOffset());
  
  if (hoy <= limite) return 0;
  
  const diffTime = hoy.getTime() - limite.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > toleranciaDias ? diffDays : 0;
}

export function detectarAbonoDuplicado(
  abono: { cliente_id: string; fecha: string; monto: number; referencia?: string | null },
  abonosExistentes: Abono[]
): boolean {
  return abonosExistentes.some(a => 
    a.cliente_id === abono.cliente_id &&
    a.fecha === abono.fecha &&
    Number(a.monto) === Number(abono.monto) &&
    a.referencia === (abono.referencia || null)
  );
}
