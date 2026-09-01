import { supabase } from '../client';
import { Configuracion } from '@/types/database';

export async function getConfiguracion() {
  try {
    const { data, error } = await supabase
      .from('configuracion')
      .select('*')
      .limit(1)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No config found, insert default
        const defaultData = {
          tolerancia_global_dias: 0,
          alertas_activas: true,
          whatsapp_activo: true,
          mensaje_recordatorio: 'Hola {nombre}, te recordamos que tienes pendiente tu cuota semanal de ${monto} correspondiente a CREDIMOTOS ROLCA. Por favor comunícate con nosotros para realizar tu abono. Gracias.'
        };
        
        const { data: newData, error: insertError } = await supabase
          .from('configuracion')
          .insert(defaultData)
          .select()
          .single();
          
        if (insertError) throw insertError;
        return newData as Configuracion;
      }
      throw error;
    }
    
    return data as Configuracion;
  } catch (error) {
    console.error('Error in getConfiguracion:', error);
    throw error;
  }
}

export async function updateConfiguracion(id: string, data: Partial<Configuracion>) {
  try {
    const { data: updated, error } = await supabase
      .from('configuracion')
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return updated as Configuracion;
  } catch (error) {
    console.error('Error in updateConfiguracion:', error);
    throw error;
  }
}
