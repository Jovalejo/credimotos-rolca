import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({ from: jest.fn() })),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

const createServerClientMock = createServerClient as jest.MockedFunction<typeof createServerClient>
const cookiesMock = cookies as jest.MockedFunction<typeof cookies>

type CookieHandlers = {
  get: (name: string) => string | undefined
  set: (name: string, value: string, options: Record<string, unknown>) => void
  remove: (name: string, options: Record<string, unknown>) => void
}

function cookieStoreStub() {
  return {
    get: jest.fn((name: string) => (name === 'sb-token' ? { name, value: 'token-value' } : undefined)),
    set: jest.fn(),
  }
}

function createWithStore(store: ReturnType<typeof cookieStoreStub>) {
  cookiesMock.mockReturnValue(store as never)
  createClient()
  const options = createServerClientMock.mock.calls[0][2] as { cookies: CookieHandlers }
  return options.cookies
}

describe('createClient (server)', () => {
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
    createWithStore(cookieStoreStub())

    expect(createServerClientMock).toHaveBeenCalledWith(
      'https://project.supabase.co',
      'anon-key',
      expect.objectContaining({ cookies: expect.any(Object) })
    )
  })

  it('reads cookie values from the request cookie store', () => {
    const store = cookieStoreStub()
    const handlers = createWithStore(store)

    expect(handlers.get('sb-token')).toBe('token-value')
    expect(handlers.get('missing')).toBeUndefined()
    expect(store.get).toHaveBeenCalledWith('sb-token')
  })

  it('writes cookies with the provided options', () => {
    const store = cookieStoreStub()
    const handlers = createWithStore(store)

    handlers.set('sb-token', 'new-value', { path: '/', httpOnly: true })

    expect(store.set).toHaveBeenCalledWith({
      name: 'sb-token',
      value: 'new-value',
      path: '/',
      httpOnly: true,
    })
  })

  it('removes cookies by writing an empty value', () => {
    const store = cookieStoreStub()
    const handlers = createWithStore(store)

    handlers.remove('sb-token', { path: '/' })

    expect(store.set).toHaveBeenCalledWith({ name: 'sb-token', value: '', path: '/' })
  })

  it('swallows cookie write errors raised from server components', () => {
    const store = cookieStoreStub()
    store.set.mockImplementation(() => {
      throw new Error('Cookies can only be modified in a Server Action')
    })
    const handlers = createWithStore(store)

    expect(() => handlers.set('sb-token', 'value', {})).not.toThrow()
    expect(() => handlers.remove('sb-token', {})).not.toThrow()
  })

  it('returns the server client instance', () => {
    const client = { from: jest.fn() }
    createServerClientMock.mockReturnValueOnce(client as never)
    cookiesMock.mockReturnValue(cookieStoreStub() as never)

    expect(createClient()).toBe(client)
  })
})
