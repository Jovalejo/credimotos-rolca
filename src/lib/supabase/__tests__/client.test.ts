import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@/lib/supabase/client'

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => ({ from: jest.fn() })),
}))

const createBrowserClientMock = createBrowserClient as jest.MockedFunction<
  typeof createBrowserClient
>

describe('createClient (browser)', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://project.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('passes the public url and anon key from the environment', () => {
    createClient()

    expect(createBrowserClientMock).toHaveBeenCalledWith('https://project.supabase.co', 'anon-key')
  })

  it('returns the browser client instance', () => {
    const client = { from: jest.fn() }
    createBrowserClientMock.mockReturnValueOnce(client as never)

    expect(createClient()).toBe(client)
  })

  it('creates a new client on each call', () => {
    createClient()
    createClient()

    expect(createBrowserClientMock).toHaveBeenCalledTimes(2)
  })
})
