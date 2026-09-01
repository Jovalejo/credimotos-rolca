import { supabase } from '../client';
import { Cuota, CuotaConCliente } from '@/types/database';
import { generarCuotasSemanales, calcularDiasAtraso } from '@/lib/calculations';

export async function getCuotasByCliente(clienteId: string) {
  try {
    const { data, error } = await supabase
      .from('cuotas')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('numero_cuota', { ascending: true });
      
    if (error) throw error;
    return data as Cuota[];
  } catch (error) {
    console.error(`Error in getCuotasByCliente (${clienteId}):`, error);
    throw error;
  }
}

export async function getCuotasPendientes(clienteId: string) {
  try {
    const { data, error } = await supabase
      .from('cuotas')
      .select('*')
      .eq('cliente_id', clienteId)
      .in('estado', ['pendiente', 'parcial', 'atrasada'])
      .order('numero_cuota', { ascending: true });
      
    if (error) throw error;
    return data as Cuota[];
  } catch (error) {
    console.error(`Error in getCuotasPendientes (${clienteId}):`, error);
    throw error;
  }
}

export async function getCuotasAtrasadas() {
  try {
    const { data, error } = await supabase
      .from('cuotas')
      .select('*, clientes(*)')
      .eq('estado', 'atrasada')
      .order('fecha_limite', { ascending: true });
      
    if (error) throw error;
    return data as unknown as CuotaConCliente[];
  } catch (error) {
    console.error('Error in getCuotasAtrasadas:', error);
    throw error;
  }
}

export async function generarCuotas(clienteId: string, cantidad: number, monto: number, fechaInicio: string, diaPago: number) {
  try {
    const cuotasNuevas = generarCuotasSemanales(clienteId, cantidad, monto, fechaInicio, diaPago);
    
    const { data, error } = await supabase
      .from('cuotas')
      .insert(cuotasNuevas)
      .select();
      
    if (error) throw error;
    return data as Cuota[];
  } catch (error) {
    console.error(`Error in generarCuotas (${clienteId}):`, error);
    throw error;
  }
}

export async function actualizarEstadoCuotas() {
  try {
    // 1. Get global tolerance
    const { data: config } = await supabase.from('configuracion').select('tolerancia_global_dias').single();
    const toleranciaGlobal = config?.tolerancia_global_dias || 0;

    // 2. Get pending and partial cuotas
    const { data: cuotas, error } = await supabase
      .from('cuotas')
      .select('*, clientes(tolerancia_dias)')
      .in('estado', ['pendiente', 'parcial']);

    if (error) throw error;
    if (!cuotas || cuotas.length === 0) return { updated: 0 };

    let updatedCount = 0;
    const clientesMora = new Set<string>();

    for (const cuota of cuotas as any[]) {
      const toleranciaCliente = cuota.clientes?.tolerancia_dias;
      const toleranciaEfectiva = toleranciaCliente !== null && toleranciaCliente !== undefined 
        ? toleranciaCliente 
        : toleranciaGlobal;
        
      const diasAtraso = calcularDiasAtraso(cuota.fecha_limite, toleranciaEfectiva);
      
      if (diasAtraso > 0) {
        // Update cuota to atrasada
        const { error: updateError } = await supabase
          .from('cuotas')
          .update({ estado: 'atrasada', dias_atraso: diasAtraso })
          .eq('id', cuota.id);
          
        if (!updateError) {
          updatedCount++;
          clientesMora.add(cuota.cliente_id);
        }
      }
    }

    // Update clients to 'en_mora'
    for (const clienteId of Array.from(clientesMora)) {
      await supabase
        .from('clientes')
        .update({ estado: 'en_mora' })
        .eq('id', clienteId);
    }

    return { updated: updatedCount };
  } catch (error) {
    console.error('Error in actualizarEstadoCuotas:', error);
    throw error;
  }
}

export async function getCuotasParaHoy() {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('cuotas')
      .select('*, clientes(*)')
      .eq('fecha_limite', hoy)
      .in('estado', ['pendiente', 'parcial']);
      
    if (error) throw error;
    return data as unknown as CuotaConCliente[];
  } catch (error) {
    console.error('Error in getCuotasParaHoy:', error);
    throw error;
  }
}
