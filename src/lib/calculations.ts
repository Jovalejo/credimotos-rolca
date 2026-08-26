import { addDays, addWeeks, addMonths } from 'date-fns';
import { PaymentFrequency } from '@/types/database';

export interface InstallmentScheduleItem {
  installment_number: number;
  due_date: Date;
  amount: number;
}

export interface FinancingBreakdown {
  downPayment: number;
  financedAmount: number;
  totalToPay: number;
  installmentAmount: number;
}

/**
 * Computes the financing breakdown for a purchase:
 * down payment, financed amount, total to pay (with flat interest) and installment amount.
 */
export function calculateFinancing(
  price: number,
  downPaymentPercent: number,
  installments: number,
  interestRate: number = 0
): FinancingBreakdown {
  const downPayment = (price * downPaymentPercent) / 100;
  const financedAmount = price - downPayment;
  const totalToPay = financedAmount * (1 + interestRate / 100);
  return {
    downPayment,
    financedAmount,
    totalToPay,
    installmentAmount: totalToPay / installments,
  };
}

/**
 * Generates an amortization schedule for a loan.
 * Assuming fixed interest has already been applied or simple calculation:
 * Total to pay = Financed Amount * (1 + Interest Rate / 100)
 */
export function generateAmortizationSchedule(
  financedAmount: number,
  termInstallments: number,
  frequency: PaymentFrequency,
  startDate: Date | string,
  interestRate: number
): InstallmentScheduleItem[] {
  const totalAmount = financedAmount * (1 + (interestRate / 100));
  const installmentAmount = totalAmount / termInstallments;
  
  const schedule: InstallmentScheduleItem[] = [];
  let currentDate = new Date(startDate);
  
  for (let i = 1; i <= termInstallments; i++) {
    // Calcular la fecha de vencimiento basada en la frecuencia
    if (frequency === 'WEEKLY') {
      currentDate = addWeeks(currentDate, 1);
    } else if (frequency === 'BIWEEKLY') {
      currentDate = addDays(currentDate, 14);
    } else if (frequency === 'MONTHLY') {
      currentDate = addMonths(currentDate, 1);
    }
    
    schedule.push({
      installment_number: i,
      due_date: new Date(currentDate),
      amount: Number(installmentAmount.toFixed(2)) // Redondear a 2 decimales
    });
  }
  
  return schedule;
}
