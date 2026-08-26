import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, buttonVariants } from '@/components/ui/button'

describe('buttonVariants', () => {
  it('applies default variant and size classes', () => {
    const classes = buttonVariants({})

    expect(classes).toContain('bg-[#DC2626]')
    expect(classes).toContain('h-10 px-4 py-2')
  })

  it('applies the requested variant and size', () => {
    const classes = buttonVariants({ variant: 'outline', size: 'lg' })

    expect(classes).toContain('border-input')
    expect(classes).toContain('h-11')
    expect(classes).not.toContain('bg-[#DC2626]')
  })
})

describe('Button', () => {
  it('renders its children as a button element', () => {
    render(<Button>Guardar</Button>)

    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
  })

  it('merges custom class names with variant classes', () => {
    render(<Button className="w-full">Guardar</Button>)

    const button = screen.getByRole('button', { name: 'Guardar' })
    expect(button).toHaveClass('w-full')
    expect(button).toHaveClass('bg-[#DC2626]')
  })

  it('calls the click handler', async () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Guardar</Button>)

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire the click handler when disabled', async () => {
    const onClick = jest.fn()
    render(
      <Button disabled onClick={onClick}>
        Guardar
      </Button>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders the child element when asChild is set', () => {
    render(
      <Button asChild>
        <a href="/dashboard">Ir al panel</a>
      </Button>
    )

    const link = screen.getByRole('link', { name: 'Ir al panel' })
    expect(link).toHaveAttribute('href', '/dashboard')
    expect(link).toHaveClass('bg-[#DC2626]')
  })

  it('forwards the ref to the underlying button', () => {
    const ref = jest.fn()
    render(<Button ref={ref}>Guardar</Button>)

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
  })
})
