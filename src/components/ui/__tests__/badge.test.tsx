import { render, screen } from '@testing-library/react'
import { Badge, badgeVariants } from '@/components/ui/badge'

describe('badgeVariants', () => {
  it('uses the default variant when none is given', () => {
    expect(badgeVariants({})).toContain('bg-primary')
  })

  it.each([
    ['success', 'bg-green-500'],
    ['warning', 'bg-yellow-500'],
    ['destructive', 'bg-destructive'],
    ['secondary', 'bg-secondary'],
    ['outline', 'text-foreground'],
  ] as const)('applies the %s variant class', (variant, expectedClass) => {
    expect(badgeVariants({ variant })).toContain(expectedClass)
  })
})

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>ACTIVO</Badge>)

    expect(screen.getByText('ACTIVO')).toBeInTheDocument()
  })

  it('merges custom classes with the variant classes', () => {
    render(<Badge variant="success" className="ml-2">PAGADO</Badge>)

    const badge = screen.getByText('PAGADO')
    expect(badge).toHaveClass('ml-2')
    expect(badge).toHaveClass('bg-green-500')
  })

  it('forwards arbitrary props to the root element', () => {
    render(<Badge data-testid="loan-status" title="Estado">MORA</Badge>)

    expect(screen.getByTestId('loan-status')).toHaveAttribute('title', 'Estado')
  })
})
