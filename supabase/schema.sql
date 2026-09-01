-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  cedula TEXT NOT NULL UNIQUE,
  telefono TEXT,
  direccion TEXT,
  moto TEXT,
  marca TEXT,
  modelo TEXT,
  anio INTEGER,
  total_moto NUMERIC(12,2),
  cantidad_cuotas INTEGER,
  monto_cuota NUMERIC(12,2),
  fecha_inicio DATE,
  dia_pago INTEGER DEFAULT 1, -- 0=Dom,1=Lun,...6=Sab
  tolerancia_dias INTEGER DEFAULT 0,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo','en_mora','pagado','cancelado')),
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: cuotas
CREATE TABLE cuotas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  numero_cuota INTEGER NOT NULL,
  fecha_limite DATE NOT NULL,
  monto_cuota NUMERIC(12,2) NOT NULL,
  monto_pagado NUMERIC(12,2) DEFAULT 0,
  saldo_cuota NUMERIC(12,2) NOT NULL,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente','pagada','parcial','atrasada')),
  dias_atraso INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: abonos
CREATE TABLE abonos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  monto NUMERIC(12,2) NOT NULL,
  metodo_pago TEXT NOT NULL CHECK (metodo_pago IN ('efectivo','transferencia','pago_movil','zelle','binance','otro')),
  referencia TEXT,
  observacion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: abono_cuotas (junction table)
CREATE TABLE abono_cuotas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  abono_id UUID NOT NULL REFERENCES abonos(id) ON DELETE CASCADE,
  cuota_id UUID NOT NULL REFERENCES cuotas(id) ON DELETE CASCADE,
  monto_aplicado NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: configuracion
CREATE TABLE configuracion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tolerancia_global_dias INTEGER DEFAULT 0,
  alertas_activas BOOLEAN DEFAULT true,
  whatsapp_activo BOOLEAN DEFAULT true,
  mensaje_recordatorio TEXT DEFAULT 'Hola {nombre}, te recordamos que tienes pendiente tu cuota semanal de ${monto} correspondiente a CREDIMOTOS ROLCA. Por favor comunícate con nosotros para realizar tu abono. Gracias.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_clientes_cedula ON clientes(cedula);
CREATE INDEX idx_clientes_telefono ON clientes(telefono);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_clientes_estado ON clientes(estado);
CREATE INDEX idx_cuotas_cliente_id ON cuotas(cliente_id);
CREATE INDEX idx_cuotas_estado ON cuotas(estado);
CREATE INDEX idx_cuotas_fecha_limite ON cuotas(fecha_limite);
CREATE INDEX idx_abonos_cliente_id ON abonos(cliente_id);
CREATE INDEX idx_abonos_fecha ON abonos(fecha);
CREATE INDEX idx_abono_cuotas_abono_id ON abono_cuotas(abono_id);
CREATE INDEX idx_abono_cuotas_cuota_id ON abono_cuotas(cuota_id);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER cuotas_updated_at BEFORE UPDATE ON cuotas FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER abonos_updated_at BEFORE UPDATE ON abonos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER configuracion_updated_at BEFORE UPDATE ON configuracion FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE abonos ENABLE ROW LEVEL SECURITY;
ALTER TABLE abono_cuotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to clientes" ON clientes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to cuotas" ON cuotas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to abonos" ON abonos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to abono_cuotas" ON abono_cuotas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to configuracion" ON configuracion FOR ALL USING (auth.role() = 'authenticated');

-- Insert default configuration
INSERT INTO configuracion (tolerancia_global_dias, alertas_activas, whatsapp_activo) VALUES (0, true, true);

-- Insert test data
INSERT INTO clientes (nombre, cedula, telefono, direccion, moto, marca, modelo, anio, total_moto, cantidad_cuotas, monto_cuota, fecha_inicio, dia_pago, tolerancia_dias, estado)
VALUES ('Juan Pérez', '28999133', '04261234567', 'Barrio El Topón, Panamericana', 'EK Owen', 'Motov', 'EK Owen', 2024, 1650.00, 8, 206.25, '2026-08-23', 6, 0, 'activo');
