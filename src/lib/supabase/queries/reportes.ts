import { supabase } from '../client';
import { DashboardStats, ReporteDiario, AbonoConCliente } from '@/types/database';

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Clientes activos (incluye en mora)
    const { count: clientesActivos } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .in('estado', ['activo', 'en_mora']);

    const { count: clientesMora } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'en_mora');

    // Total cobrado mes actual
    const fechaActual = new Date();
    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).toISOString().split('T')[0];
    
    const { data: abonosMes } = await supabase
      .from('abonos')
      .select('monto')
      .gte('fecha', primerDiaMes);
      
    const totalCobradoMes = abonosMes?.reduce((sum, a) => sum + Number(a.monto), 0) || 0;

    // Cuotas atrasadas total
    const { data: cuotasAtrasadas } = await supabase
      .from('cuotas')
      .select('saldo_cuota')
      .eq('estado', 'atrasada');
      
    const totalPendienteMora = cuotasAtrasadas?.reduce((sum, c) => sum + Number(c.saldo_cuota), 0) || 0;
    
    // Total pendiente del mes (cuotas con fecha en este mes que no están pagadas)
    const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const { data: cuotasMes } = await supabase
      .from('cuotas')
      .select('saldo_cuota')
      .gte('fecha_limite', primerDiaMes)
      .lte('fecha_limite', ultimoDiaMes)
      .in('estado', ['pendiente', 'parcial', 'atrasada']);
      
    const totalPendienteMes = cuotasMes?.reduce((sum, c) => sum + Number(c.saldo_cuota), 0) || 0;

    return {
      clientes_activos: clientesActivos || 0,
      clientes_mora: clientesMora || 0,
      total_cobrado_mes: totalCobradoMes,
      total_pendiente_mes: totalPendienteMes,
      cuotas_atrasadas_total: totalPendienteMora
    };
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    throw error;
  }
}

export async function getReporteDiario(fecha: string): Promise<ReporteDiario> {
  try {
    const { data: abonos, error } = await supabase
      .from('abonos')
      .select('*, clientes(*)')
      .eq('fecha', fecha)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const totalRecaudado = abonos?.reduce((sum, a) => sum + Number(a.monto), 0) || 0;

    return {
      fecha,
      total_recaudado: totalRecaudado,
      cantidad_abonos: abonos?.length || 0,
      abonos: (abonos || []) as unknown as AbonoConCliente[]
    };
  } catch (error) {
    console.error(`Error in getReporteDiario (${fecha}):`, error);
    throw error;
  }
}

export async function getReporteSemanal(fechaInicio: string, fechaFin: string) {
  try {
    const { data: abonos, error } = await supabase
      .from('abonos')
      .select('fecha, monto, metodo_pago')
      .gte('fecha', fechaInicio)
      .lte('fecha', fechaFin);
      
    if (error) throw error;
    
    const total = abonos?.reduce((sum, a) => sum + Number(a.monto), 0) || 0;
    
    // Agrupar por fecha
    const porDia = abonos?.reduce((acc: Record<string, number>, curr) => {
      acc[curr.fecha] = (acc[curr.fecha] || 0) + Number(curr.monto);
      return acc;
    }, {});
    
    // Agrupar por método
    const porMetodo = abonos?.reduce((acc: Record<string, number>, curr) => {
      acc[curr.metodo_pago] = (acc[curr.metodo_pago] || 0) + Number(curr.monto);
      return acc;
    }, {});
    
    return {
      total,
      cantidad: abonos?.length || 0,
      porDia,
      porMetodo
    };
  } catch (error) {
    console.error('Error in getReporteSemanal:', error);
    throw error;
  }
}

export async function getReporteMensual(mes: number, anio: number) {
  try {
    const fechaInicio = new Date(anio, mes - 1, 1).toISOString().split('T')[0];
    const fechaFin = new Date(anio, mes, 0).toISOString().split('T')[0];
    
    return getReporteSemanal(fechaInicio, fechaFin);
  } catch (error) {
    console.error('Error in getReporteMensual:', error);
    throw error;
  }
}

export async function getCobranzaData(filtro: 'hoy' | 'semana' | 'mes' | 'atrasadas' = 'hoy') {
  try {
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split('T')[0];
    
    let query = supabase.from('cuotas').select('*, clientes(*)');
    
    if (filtro === 'hoy') {
      query = query.eq('fecha_limite', hoyStr).in('estado', ['pendiente', 'parcial']);
    } else if (filtro === 'semana') {
      // De hoy hasta en 7 días
      const proximaSemana = new Date(hoy);
      proximaSemana.setDate(hoy.getDate() + 7);
      const limitStr = proximaSemana.toISOString().split('T')[0];
      
      query = query.gte('fecha_limite', hoyStr).lte('fecha_limite', limitStr).in('estado', ['pendiente', 'parcial']);
    } else if (filtro === 'mes') {
      const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0];
      query = query.gte('fecha_limite', hoyStr).lte('fecha_limite', ultimoDiaMes).in('estado', ['pendiente', 'parcial']);
    } else if (filtro === 'atrasadas') {
      query = query.eq('estado', 'atrasada');
    }
    
    const { data, error } = await query.order('fecha_limite', { ascending: true });
    
    if (error) throw error;
    return data as any[];
  } catch (error) {
    console.error('Error in getCobranzaData:', error);
    throw error;
  }
}
