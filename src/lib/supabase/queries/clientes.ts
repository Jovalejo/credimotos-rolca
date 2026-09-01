import { supabase } from '../client';
import { Cliente, ClienteConResumen } from '@/types/database';

export async function getClientes(search?: string, page: number = 1, limit: number = 10) {
  try {
    let query = supabase.from('clientes').select('*', { count: 'exact' });
    
    if (search) {
      query = query.or(`nombre.ilike.%${search}%,cedula.ilike.%${search}%,telefono.ilike.%${search}%`);
    }
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
      
    if (error) throw error;
    
    return { data: data as Cliente[], count: count || 0 };
  } catch (error) {
    console.error('Error in getClientes:', error);
    throw error;
  }
}

export async function getClienteById(id: string) {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as Cliente;
  } catch (error) {
    console.error(`Error in getClienteById (${id}):`, error);
    throw error;
  }
}

export async function getClienteResumen(id: string) {
  try {
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();
      
    if (clienteError) throw clienteError;
    
    // Get abonos to calculate total
    const { data: abonos, error: abonosError } = await supabase
      .from('abonos')
      .select('monto')
      .eq('cliente_id', id);
      
    if (abonosError) throw abonosError;
    
    const totalAbonado = abonos?.reduce((sum, abono) => sum + Number(abono.monto), 0) || 0;
    
    // Get cuotas to calculate stats
    const { data: cuotas, error: cuotasError } = await supabase
      .from('cuotas')
      .select('estado, saldo_cuota')
      .eq('cliente_id', id);
      
    if (cuotasError) throw cuotasError;
    
    const cuotasPagadas = cuotas?.filter(c => c.estado === 'pagada').length || 0;
    const cuotasPendientes = cuotas?.filter(c => ['pendiente', 'parcial', 'atrasada'].includes(c.estado)).length || 0;
    const cuotasAtrasadas = cuotas?.filter(c => c.estado === 'atrasada').length || 0;
    const saldoPendiente = cuotas?.reduce((sum, c) => sum + Number(c.saldo_cuota), 0) || 0;
    
    return {
      ...cliente,
      total_abonado: totalAbonado,
      saldo_pendiente: saldoPendiente,
      cuotas_pagadas: cuotasPagadas,
      cuotas_pendientes: cuotasPendientes,
      cuotas_atrasadas: cuotasAtrasadas
    } as ClienteConResumen;
  } catch (error) {
    console.error(`Error in getClienteResumen (${id}):`, error);
    throw error;
  }
}

export async function createCliente(data: Partial<Cliente>) {
  try {
    const { data: newCliente, error } = await supabase
      .from('clientes')
      .insert(data)
      .select()
      .single();
      
    if (error) throw error;
    return newCliente as Cliente;
  } catch (error) {
    console.error('Error in createCliente:', error);
    throw error;
  }
}

export async function updateCliente(id: string, data: Partial<Cliente>) {
  try {
    const { data: updatedCliente, error } = await supabase
      .from('clientes')
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return updatedCliente as Cliente;
  } catch (error) {
    console.error(`Error in updateCliente (${id}):`, error);
    throw error;
  }
}

export async function deleteCliente(id: string) {
  try {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error in deleteCliente (${id}):`, error);
    throw error;
  }
}

export async function buscarClientes(queryStr: string) {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .or(`nombre.ilike.%${queryStr}%,cedula.ilike.%${queryStr}%,telefono.ilike.%${queryStr}%`)
      .limit(20);
      
    if (error) throw error;
    return data as Cliente[];
  } catch (error) {
    console.error('Error in buscarClientes:', error);
    throw error;
  }
}
