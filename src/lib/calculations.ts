import { addDays, addWeeks, addMonths } from 'date-fns';
import { PaymentFrequency } from '@/types/database';

export interface InstallmentScheduleItem {
  installment_number: number;
  due_date: Date;
  amount: number;
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
  if (!Number.isFinite(financedAmount) || financedAmount < 0) {
    throw new RangeError('Financed amount must be a non-negative finite number');
  }

  if (!Number.isInteger(termInstallments) || termInstallments <= 0) {
    throw new RangeError('Term installments must be a positive integer');
  }

  if (!Number.isFinite(interestRate) || interestRate < 0) {
    throw new RangeError('Interest rate must be a non-negative finite number');
  }

  const parsedStartDate = new Date(startDate);
  if (Number.isNaN(parsedStartDate.getTime())) {
    throw new RangeError('Start date must be a valid date');
  }

  const totalAmount = financedAmount * (1 + (interestRate / 100));
  const installmentAmount = totalAmount / termInstallments;
  
  const schedule: InstallmentScheduleItem[] = [];
  let currentDate = parsedStartDate;
  
  for (let i = 1; i <= termInstallments; i++) {
    // Calcular la fecha de vencimiento basada en la frecuencia
    switch (frequency) {
      case 'WEEKLY':
        currentDate = addWeeks(currentDate, 1);
        break;
      case 'BIWEEKLY':
        currentDate = addDays(currentDate, 14);
        break;
      case 'MONTHLY':
        currentDate = addMonths(currentDate, 1);
        break;
      default:
        throw new RangeError(`Unsupported payment frequency: ${String(frequency)}`);
    }
    
    schedule.push({
      installment_number: i,
      due_date: new Date(currentDate),
      amount: Number(installmentAmount.toFixed(2)) // Redondear a 2 decimales
    });
  }
  
  return schedule;
}
