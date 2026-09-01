import { supabase } from '@/lib/supabase/client'
import type { Cuota, Cliente } from '@/types/database'

export interface CobranzaItem {
  cliente_id: string
  cliente_nombre: string
  cliente_telefono: string
  cliente_cedula: string
  cliente_moto: string
  cuota_id: string
  numero_cuota: number
  fecha_limite: string
  monto_cuota: number
  saldo_cuota: number
  dias_atraso: number
  estado: string
}

export async function getCobranzaData(filtro: string = 'todos'): Promise<CobranzaItem[]> {
  try {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    // Get start/end of current week (Monday to Sunday)
    const dayOfWeek = today.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() + mondayOffset)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0]
    const endOfWeekStr = endOfWeek.toISOString().split('T')[0]

    // Get all cuotas that are not fully paid, with client data
    const { data: cuotas, error } = await supabase
      .from('cuotas')
      .select(`
        id,
        cliente_id,
        numero_cuota,
        fecha_limite,
        monto_cuota,
        monto_pagado,
        saldo_cuota,
        estado,
        dias_atraso,
        clientes (
          id,
          nombre,
          telefono,
          cedula,
          moto
        )
      `)
      .in('estado', ['pendiente', 'parcial', 'atrasada'])
      .order('dias_atraso', { ascending: false })

    if (error) throw error

    let items: CobranzaItem[] = (cuotas || []).map((c: any) => {
      const diasAtraso = c.fecha_limite < todayStr
        ? Math.floor((today.getTime() - new Date(c.fecha_limite).getTime()) / (1000 * 60 * 60 * 24))
        : 0

      return {
        cliente_id: c.cliente_id,
        cliente_nombre: c.clientes?.nombre || '',
        cliente_telefono: c.clientes?.telefono || '',
        cliente_cedula: c.clientes?.cedula || '',
        cliente_moto: c.clientes?.moto || '',
        cuota_id: c.id,
        numero_cuota: c.numero_cuota,
        fecha_limite: c.fecha_limite,
        monto_cuota: c.monto_cuota,
        saldo_cuota: c.saldo_cuota,
        dias_atraso: diasAtraso > 0 ? diasAtraso : 0,
        estado: diasAtraso > 0 ? 'atrasada' : c.estado,
      }
    })

    // Apply filters
    switch (filtro) {
      case 'hoy':
        items = items.filter(i => i.fecha_limite === todayStr)
        break
      case 'atrasados':
        items = items.filter(i => i.dias_atraso > 0)
        break
      case '1-3':
        items = items.filter(i => i.dias_atraso >= 1 && i.dias_atraso <= 3)
        break
      case '4-7':
        items = items.filter(i => i.dias_atraso >= 4 && i.dias_atraso <= 7)
        break
      case 'mas7':
        items = items.filter(i => i.dias_atraso > 7)
        break
      case 'pagaron_semana': {
        // Clients who made at least one payment this week
        const { data: abonosSemana } = await supabase
          .from('abonos')
          .select('cliente_id')
          .gte('fecha', startOfWeekStr)
          .lte('fecha', endOfWeekStr)
        const clientesQueAbonaron = new Set((abonosSemana || []).map((a: any) => a.cliente_id))
        items = items.filter(i => clientesQueAbonaron.has(i.cliente_id))
        break
      }
      case 'no_pagaron_semana': {
        const { data: abonosSemana2 } = await supabase
          .from('abonos')
          .select('cliente_id')
          .gte('fecha', startOfWeekStr)
          .lte('fecha', endOfWeekStr)
        const clientesQueAbonaron2 = new Set((abonosSemana2 || []).map((a: any) => a.cliente_id))
        items = items.filter(i => !clientesQueAbonaron2.has(i.cliente_id))
        break
      }
      default:
        break
    }

    // Sort by most days overdue
    items.sort((a, b) => b.dias_atraso - a.dias_atraso)

    return items
  } catch (error) {
    console.error('Error fetching cobranza data:', error)
    throw error
  }
}

export async function getMensajeCobranza(clienteNombre: string, montoCuota: number): Promise<string> {
  try {
    const { data } = await supabase
      .from('configuracion')
      .select('mensaje_recordatorio')
      .limit(1)
      .single()

    let mensaje = data?.mensaje_recordatorio ||
      'Hola {nombre}, te recordamos que tienes pendiente tu cuota semanal de ${monto} correspondiente a CREDIMOTOS ROLCA. Por favor comunícate con nosotros para realizar tu abono. Gracias.'

    mensaje = mensaje.replace('{nombre}', clienteNombre)
    mensaje = mensaje.replace('{monto}', montoCuota.toFixed(2))

    return mensaje
  } catch {
    return `Hola ${clienteNombre}, te recordamos que tienes pendiente tu cuota semanal de $${montoCuota.toFixed(2)} correspondiente a CREDIMOTOS ROLCA. Por favor comunícate con nosotros para realizar tu abono. Gracias.`
  }
}
