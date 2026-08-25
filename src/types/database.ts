export type IdDocType = 'V' | 'E' | 'J' | 'P';
export type MotorcycleStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD';
export type PaymentFrequency = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
export type LoanStatus = 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';
export type InstallmentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
export type PaymentMethod = 'CASH_USD' | 'PAGO_MOVIL' | 'TRANSFER_VES' | 'ZELLE' | 'BINANCE_USDT' | 'PUNTO_VENTA';
export type Role = 'admin' | 'operator' | 'viewer';

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  created_at: string;
}

export interface Client {
  id: string;
  id_doc_type: IdDocType;
  id_number: string;
  first_name: string;
  last_name: string;
  phone: string;
  phone_alt?: string;
  email?: string;
  address: string;
  guarantor_name?: string;
  guarantor_phone?: string;
  created_at: string;
}

export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  vin_chassis: string;
  engine_number: string;
  color: string;
  cash_price: number;
  credit_price: number;
  status: MotorcycleStatus;
  image_url?: string;
  created_at: string;
}

export interface Loan {
  id: string;
  loan_number: string;
  client_id: string;
  motorcycle_id: string;
  total_amount: number;
  down_payment: number;
  financed_amount: number;
  interest_rate: number;
  term_installments: number;
  payment_frequency: PaymentFrequency;
  installment_amount: number;
  start_date: string;
  status: LoanStatus;
  created_at: string;
  
  // Optional joined relations
  client?: Client;
  motorcycle?: Motorcycle;
}

export interface Installment {
  id: string;
  loan_id: string;
  installment_number: number;
  due_date: string;
  amount: number;
  amount_paid: number;
  status: InstallmentStatus;
  created_at: string;
}

export interface Payment {
  id: string;
  receipt_number: string;
  loan_id: string;
  installment_id: string;
  payment_date: string;
  amount_usd: number;
  amount_ves: number;
  exchange_rate_bcv: number;
  payment_method: PaymentMethod;
  reference_number?: string;
  proof_file_url?: string;
  notes?: string;
  registered_by: string; // Refers to Profile ID
  created_at: string;
}
