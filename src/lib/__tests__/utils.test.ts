import { cn, formatUSD, formatVES, formatDate, formatShortDate } from '@/lib/utils'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('px-2', 'text-sm')).toBe('px-2 text-sm')
  })

  it('drops falsy values and supports conditional objects', () => {
    expect(cn('px-2', false && 'hidden', undefined, { 'text-sm': true, 'text-lg': false })).toBe(
      'px-2 text-sm'
    )
  })

  it('lets the last conflicting tailwind class win', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })
})

describe('formatUSD', () => {
  it('formats with a dollar sign and two decimals', () => {
    expect(formatUSD(1234.5)).toBe('$1,234.50')
  })

  it('formats zero and negative amounts', () => {
    expect(formatUSD(0)).toBe('$0.00')
    expect(formatUSD(-50)).toBe('-$50.00')
  })

  it('rounds to cents', () => {
    expect(formatUSD(9.999)).toBe('$10.00')
  })
})

describe('formatVES', () => {
  it('includes the bolivar currency symbol and the amount', () => {
    const formatted = formatVES(1234.5)

    expect(formatted).toContain('Bs')
    expect(formatted).toMatch(/1[.,]234/)
  })

  it('formats zero', () => {
    expect(formatVES(0)).toContain('0')
  })
})

describe('formatDate', () => {
  it('formats a long Spanish date from a Date', () => {
    expect(formatDate(new Date(2024, 0, 15))).toBe('15 de enero, 2024')
  })

  it('formats from a timestamp and an ISO string', () => {
    const date = new Date(2024, 11, 31)
    expect(formatDate(date.getTime())).toBe('31 de diciembre, 2024')
    expect(formatDate('2024-12-31T12:00:00')).toBe('31 de diciembre, 2024')
  })
})

describe('formatShortDate', () => {
  it('formats as dd/MM/yyyy with zero padding', () => {
    expect(formatShortDate(new Date(2024, 6, 4))).toBe('04/07/2024')
  })

  it('formats from an ISO string', () => {
    expect(formatShortDate('2023-02-28T08:30:00')).toBe('28/02/2023')
  })
})
