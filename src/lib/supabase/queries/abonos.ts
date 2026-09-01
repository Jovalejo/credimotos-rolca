import { supabase } from '../client';
import { Abono, AbonoConCliente, Cuota } from '@/types/database';
import { aplicarAbonoACuotas } from '@/lib/calculations';

export async function getAbonos(filters?: { fecha?: string; fechaDesde?: string; fechaHasta?: string; clienteId?: string; metodo?: string; metodoPago?: string }, page: number = 1, limit: number = 20) {
  try {
    let query = supabase
      .from('abonos')
      .select('*, clientes(*)', { count: 'exact' });
      
    if (filters?.fecha) {
      query = query.eq('fecha', filters.fecha);
    }
    if (filters?.fechaDesde) {
      query = query.gte('fecha', filters.fechaDesde);
    }
    if (filters?.fechaHasta) {
      query = query.lte('fecha', filters.fechaHasta);
    }
    if (filters?.clienteId) {
      query = query.eq('cliente_id', filters.clienteId);
    }
    if (filters?.metodo || filters?.metodoPago) {
      query = query.eq('metodo_pago', filters.metodo || filters.metodoPago);
    }
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
      
    if (error) throw error;
    return { data: data as unknown as AbonoConCliente[], count: count || 0 };
  } catch (error) {
    console.error('Error in getAbonos:', error);
    throw error;
  }
}

export async function getAbonosByCliente(clienteId: string) {
  try {
    const { data, error } = await supabase
      .from('abonos')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('fecha', { ascending: false })
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Abono[];
  } catch (error) {
    console.error(`Error in getAbonosByCliente (${clienteId}):`, error);
    throw error;
  }
}

export async function getAbonosHoy() {
  const hoy = new Date().toISOString().split('T')[0];
  return getAbonos({ fecha: hoy }, 1, 100);
}

export async function createAbono(data: {
  cliente_id: string;
  fecha: string;
  monto: number;
  metodo_pago: string;
  referencia?: string;
  observacion?: string;
}) {
  try {
    // 1. Get pending cuotas for this client
    const { data: cuotasPendientes, error: cuotasError } = await supabase
      .from('cuotas')
      .select('*')
      .eq('cliente_id', data.cliente_id)
      .in('estado', ['pendiente', 'parcial', 'atrasada'])
      .order('numero_cuota', { ascending: true });

    if (cuotasError) throw cuotasError;

    // 2. Create the abono
    const { data: newAbono, error: abonoError } = await supabase
      .from('abonos')
      .insert(data)
      .select()
      .single();

    if (abonoError) throw abonoError;

    // 3. Calculate applications
    const { cuotasActualizadas, abonosCuotas } = aplicarAbonoACuotas(
      { id: newAbono.id, monto: data.monto },
      cuotasPendientes as Cuota[]
    );

    // 4. Update cuotas
    for (const cuota of cuotasActualizadas) {
      const { error: updateError } = await supabase
        .from('cuotas')
        .update({
          monto_pagado: cuota.monto_pagado,
          saldo_cuota: cuota.saldo_cuota,
          estado: cuota.estado,
          dias_atraso: cuota.dias_atraso
        })
        .eq('id', cuota.id);
        
      if (updateError) throw updateError;
    }

    // 5. Insert abono_cuotas relationships
    if (abonosCuotas.length > 0) {
      const { error: relacionError } = await supabase
        .from('abono_cuotas')
        .insert(abonosCuotas);
        
      if (relacionError) throw relacionError;
    }
    
    // 6. Check if client is fully paid
    const { data: remainingCuotas, error: checkError } = await supabase
      .from('cuotas')
      .select('id')
      .eq('cliente_id', data.cliente_id)
      .in('estado', ['pendiente', 'parcial', 'atrasada'])
      .limit(1);
      
    if (checkError) throw checkError;
    
    if (remainingCuotas.length === 0) {
      await supabase
        .from('clientes')
        .update({ estado: 'pagado' })
        .eq('id', data.cliente_id);
    } else {
      // Si el cliente estaba en mora pero pagó lo atrasado, volverlo activo
      const hasAtrasadas = cuotasActualizadas.some(c => c.estado === 'atrasada') ||
        cuotasPendientes.some(c => c.estado === 'atrasada' && !cuotasActualizadas.find(ca => ca.id === c.id));
        
      if (!hasAtrasadas) {
        await supabase
          .from('clientes')
          .update({ estado: 'activo' })
          .eq('id', data.cliente_id);
      }
    }

    return newAbono as Abono;
  } catch (error) {
    console.error('Error in createAbono:', error);
    throw error;
  }
}

export async function updateAbono(id: string, data: Partial<Abono>) {
  try {
    const { data: updatedAbono, error } = await supabase
      .from('abonos')
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return updatedAbono as Abono;
  } catch (error) {
    console.error(`Error in updateAbono (${id}):`, error);
    throw error;
  }
}

export async function deleteAbono(id: string) {
  try {
    // 1. Get abono details and related cuotas
    const { data: abonoCuotas, error: relError } = await supabase
      .from('abono_cuotas')
      .select('cuota_id, monto_aplicado')
      .eq('abono_id', id);
      
    if (relError) throw relError;

    // 2. Revert cuotas
    if (abonoCuotas && abonoCuotas.length > 0) {
      for (const ac of abonoCuotas) {
        const { data: cuota, error: cuotaError } = await supabase
          .from('cuotas')
          .select('monto_pagado, saldo_cuota, monto_cuota, fecha_limite')
          .eq('id', ac.cuota_id)
          .single();
          
        if (cuotaError || !cuota) continue;
        
        const nuevoMontoPagado = Number(cuota.monto_pagado) - Number(ac.monto_aplicado);
        const nuevoSaldo = Number(cuota.saldo_cuota) + Number(ac.monto_aplicado);
        
        // Determinar el nuevo estado
        let nuevoEstado = 'pendiente';
        if (nuevoMontoPagado > 0) nuevoEstado = 'parcial';
        
        // Check if it should be overdue
        const hoy = new Date();
        const limite = new Date(cuota.fecha_limite);
        if (hoy > limite && nuevoSaldo > 0) {
          nuevoEstado = 'atrasada';
        }
        
        await supabase
          .from('cuotas')
          .update({
            monto_pagado: nuevoMontoPagado,
            saldo_cuota: nuevoSaldo,
            estado: nuevoEstado
          })
          .eq('id', ac.cuota_id);
      }
    }

    // 3. Delete abono (cascade should handle abono_cuotas)
    const { error } = await supabase
      .from('abonos')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    // Update client status if needed
    if (abonoCuotas && abonoCuotas.length > 0) {
      // Get any abono to find the client_id
      const { data: abonoInfo } = await supabase.from('abonos').select('cliente_id').eq('id', id).single();
      
      if (abonoInfo) {
        const { data: atrasadas } = await supabase
          .from('cuotas')
          .select('id')
          .eq('cliente_id', abonoInfo.cliente_id)
          .eq('estado', 'atrasada')
          .limit(1);
          
        if (atrasadas && atrasadas.length > 0) {
          await supabase.from('clientes').update({ estado: 'en_mora' }).eq('id', abonoInfo.cliente_id);
        } else {
          await supabase.from('clientes').update({ estado: 'activo' }).eq('id', abonoInfo.cliente_id);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error in deleteAbono (${id}):`, error);
    throw error;
  }
}

export async function getAbonosDuplicados(clienteId: string, fecha: string, monto: number, referencia?: string) {
  try {
    let query = supabase
      .from('abonos')
      .select('*')
      .eq('cliente_id', clienteId)
      .eq('fecha', fecha)
      .eq('monto', monto);
      
    if (referencia) {
      query = query.eq('referencia', referencia);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return data as Abono[];
  } catch (error) {
    console.error('Error in getAbonosDuplicados:', error);
    throw error;
  }
}

export async function checkDuplicateAbono(clienteId: string, fecha: string, monto: number, referencia?: string): Promise<boolean> {
  const duplicados = await getAbonosDuplicados(clienteId, fecha, monto, referencia);
  return duplicados.length > 0;
}
