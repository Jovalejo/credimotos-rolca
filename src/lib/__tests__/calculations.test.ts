import { generateAmortizationSchedule } from '@/lib/calculations'

describe('generateAmortizationSchedule', () => {
  it('divides the amount plus interest evenly across the installments', () => {
    const schedule = generateAmortizationSchedule(1000, 4, 'MONTHLY', '2024-01-15', 20)

    expect(schedule).toHaveLength(4)
    expect(schedule.map((i) => i.amount)).toEqual([300, 300, 300, 300])
    expect(schedule.map((i) => i.installment_number)).toEqual([1, 2, 3, 4])
  })

  it('rounds each installment to two decimals', () => {
    const schedule = generateAmortizationSchedule(1000, 3, 'MONTHLY', '2024-01-01', 0)

    expect(schedule.every((i) => i.amount === 333.33)).toBe(true)
  })

  it('applies no interest when the rate is zero', () => {
    const schedule = generateAmortizationSchedule(2400, 12, 'MONTHLY', '2024-01-01', 0)

    const total = schedule.reduce((sum, i) => sum + i.amount, 0)
    expect(total).toBeCloseTo(2400, 2)
  })

  it('spaces weekly due dates seven days apart, starting one week after start date', () => {
    const schedule = generateAmortizationSchedule(300, 3, 'WEEKLY', '2024-03-01', 0)

    expect(schedule.map((i) => i.due_date.toISOString().slice(0, 10))).toEqual([
      '2024-03-08',
      '2024-03-15',
      '2024-03-22',
    ])
  })

  it('spaces biweekly due dates fourteen days apart', () => {
    const schedule = generateAmortizationSchedule(300, 3, 'BIWEEKLY', '2024-03-01', 0)

    expect(schedule.map((i) => i.due_date.toISOString().slice(0, 10))).toEqual([
      '2024-03-15',
      '2024-03-29',
      '2024-04-12',
    ])
  })

  it('spaces monthly due dates one month apart', () => {
    const schedule = generateAmortizationSchedule(300, 3, 'MONTHLY', '2024-03-15', 0)

    expect(schedule.map((i) => i.due_date.toISOString().slice(0, 10))).toEqual([
      '2024-04-15',
      '2024-05-15',
      '2024-06-15',
    ])
  })

  it('clamps a month-end start date to the shorter month and keeps that day afterwards', () => {
    const schedule = generateAmortizationSchedule(300, 3, 'MONTHLY', '2024-01-31', 0)

    expect(schedule.map((i) => i.due_date.toISOString().slice(0, 10))).toEqual([
      '2024-02-29',
      '2024-03-29',
      '2024-04-29',
    ])
  })

  it('accepts a Date start date without mutating it', () => {
    const startDate = new Date('2024-05-10T00:00:00.000Z')
    const schedule = generateAmortizationSchedule(200, 2, 'MONTHLY', startDate, 0)

    expect(startDate.toISOString()).toBe('2024-05-10T00:00:00.000Z')
    expect(schedule[0].due_date.toISOString().slice(0, 10)).toBe('2024-06-10')
  })

  it('returns independent Date objects per installment', () => {
    const schedule = generateAmortizationSchedule(200, 2, 'MONTHLY', '2024-01-01', 0)

    expect(schedule[0].due_date).not.toBe(schedule[1].due_date)
    expect(schedule[0].due_date.getTime()).toBeLessThan(schedule[1].due_date.getTime())
  })

  it('returns an empty schedule for a zero term', () => {
    expect(generateAmortizationSchedule(1000, 0, 'MONTHLY', '2024-01-01', 10)).toEqual([])
  })
})
