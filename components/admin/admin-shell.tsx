'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, LogOut, User, ChevronRight } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

// ─── Auth context ─────────────────────────────────────────────────────────────

interface AuthCtx {
  token: string | null
  user: { name: string; email: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const Auth = createContext<AuthCtx>({ token: null, user: null, login: async () => {}, logout: () => {} })
export const useAuth = () => useContext(Auth)

// ─── Login page ───────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: (token: string, user: { name: string; email: string }) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? data.errors?.email?.[0] ?? 'Login failed.')
        return
      }
      onLogin(data.token, data.user)
    } catch {
      setError('Cannot reach the API. Make sure the Laravel server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#FAF6F0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '380px',
        background: '#FFFFFF', borderRadius: '16px',
        border: '1.5px solid #E8DCCF',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ background: '#8B1E24', padding: '24px 28px' }}>
          <div style={{ fontFamily: 'var(--font-heading, serif)', fontWeight: 800, fontSize: '20px', color: '#FFFFFF', marginBottom: '4px' }}>
            DKC Admin Panel
          </div>
          <div style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            Dibrugarh Korean Club
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ padding: '28px' }}>
          {error && (
            <div style={{ background: '#FEF3F0', border: '1px solid #F5CECA', borderRadius: '8px', padding: '10px 12px', marginBottom: '16px', fontSize: '13px', color: '#8B1E24', fontFamily: 'var(--font-sans, sans-serif)' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#6B6B6B', fontFamily: 'var(--font-sans, sans-serif)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Email
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required autoFocus
                placeholder="admin@dkc.local"
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E8DCCF', fontSize: '14px', fontFamily: 'var(--font-sans, sans-serif)', color: '#1A1008', outline: 'none', background: '#FDFAF6' }}
                onFocus={e => e.target.style.borderColor = '#8B1E24'}
                onBlur={e => e.target.style.borderColor = '#E8DCCF'}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#6B6B6B', fontFamily: 'var(--font-sans, sans-serif)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E8DCCF', fontSize: '14px', fontFamily: 'var(--font-sans, sans-serif)', color: '#1A1008', outline: 'none', background: '#FDFAF6' }}
                onFocus={e => e.target.style.borderColor = '#8B1E24'}
                onBlur={e => e.target.style.borderColor = '#E8DCCF'}
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '11px', borderRadius: '9px', border: 'none',
              background: loading ? '#C4B8B8' : '#8B1E24', color: '#FFFFFF',
              fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-sans, sans-serif)',
              cursor: loading ? 'default' : 'pointer', transition: 'background 0.15s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

function AdminSidebar({ user, onLogout }: { user: { name: string; email: string }; onLogout: () => void }) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin/learning', label: 'Learning', icon: <BookOpen size={16} />, match: '/admin/learning' },
  ]

  return (
    <aside style={{
      width: '220px', flexShrink: 0, background: '#1A1008',
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontFamily: 'var(--font-heading, serif)', fontWeight: 800, fontSize: '15px', color: '#FFFFFF', lineHeight: 1.2 }}>
          DKC Admin
        </div>
        <div style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
          Dibrugarh Korean Club
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ padding: '4px 10px 8px', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-sans, sans-serif)' }}>
          Content
        </div>
        {navItems.map(item => {
          const active = pathname.startsWith(item.match)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '8px', textDecoration: 'none',
                background: active ? 'rgba(139,30,36,0.9)' : 'transparent',
                color: active ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-sans, sans-serif)', fontSize: '13px', fontWeight: active ? 700 : 400,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = '#fff' } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' } }}
            >
              {item.icon}
              {item.label}
              {active && <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', marginBottom: '6px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={13} color="rgba(255,255,255,0.6)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '12px', fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
            <div style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '10px', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
            padding: '8px 12px', borderRadius: '8px', border: 'none',
            background: 'transparent', color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-sans, sans-serif)',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)' }}
        >
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </aside>
  )
}

// ─── Shell — handles auth state + layout ─────────────────────────────────────

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [ready, setReady] = useState(false)

  // Restore session from localStorage
  useEffect(() => {
    const t = localStorage.getItem('dkc_admin_token')
    const u = localStorage.getItem('dkc_admin_user')
    if (t && u) {
      setToken(t)
      setUser(JSON.parse(u))
    }
    setReady(true)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? data.errors?.email?.[0] ?? 'Login failed.')
    localStorage.setItem('dkc_admin_token', data.token)
    localStorage.setItem('dkc_admin_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    if (token) {
      fetch(`${API}/admin/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }).catch(() => {})
    }
    localStorage.removeItem('dkc_admin_token')
    localStorage.removeItem('dkc_admin_user')
    setToken(null)
    setUser(null)
  }

  if (!ready) {
    return <div style={{ minHeight: '100vh', background: '#FAF6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-sans, sans-serif)', color: '#9CA3AF', fontSize: '14px' }}>Loading…</div>
    </div>
  }

  if (!token || !user) {
    return (
      <Auth.Provider value={{ token, user, login, logout }}>
        <LoginPage onLogin={(t, u) => { localStorage.setItem('dkc_admin_token', t); localStorage.setItem('dkc_admin_user', JSON.stringify(u)); setToken(t); setUser(u) }} />
      </Auth.Provider>
    )
  }

  return (
    <Auth.Provider value={{ token, user, login, logout }}>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF6F0' }}>
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <AdminSidebar user={user} onLogout={logout} />
        </div>

        {/* Mobile top bar */}
        <div className="md:hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, height: '52px', background: '#1A1008', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-heading, serif)', fontWeight: 800, fontSize: '14px', color: '#FFFFFF', flex: 1 }}>DKC Admin</span>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-sans, sans-serif)' }}>
            <LogOut size={12} /> Sign out
          </button>
        </div>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0, background: '#FAF6F0' }} className="pt-0 md:pt-0">
          {/* Mobile spacer for fixed top bar */}
          <div className="md:hidden" style={{ height: '52px' }} />
          {children}
        </main>
      </div>
    </Auth.Provider>
  )
}
