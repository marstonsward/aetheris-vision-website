'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin/clients',  label: 'Clients' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/expenses', label: 'Expenses' },
]

async function handleLogout() {
  await fetch('/api/admin/auth', { method: 'DELETE' })
  window.location.href = '/admin/login'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <div style={{ colorScheme: 'light', backgroundColor: '#f9fafb', color: '#111827', minHeight: '100vh' }}>
        {children}
      </div>
    )
  }

  return (
    <div style={{ colorScheme: 'light', backgroundColor: '#f9fafb', color: '#111827', minHeight: '100vh' }}>
      <header style={{
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        padding: '0 24px', position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          maxWidth: '960px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '56px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '6px',
                background: '#1e3a5f',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: '800' }}>AV</span>
              </div>
              <span style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>Admin</span>
            </div>
            <nav style={{ display: 'flex', gap: '4px' }}>
              {NAV.map(n => {
                const active = pathname.startsWith(n.href)
                return (
                  <Link key={n.href} href={n.href} style={{
                    padding: '6px 12px', borderRadius: '6px', fontSize: '14px',
                    fontWeight: active ? '600' : '500',
                    color: active ? '#1e3a5f' : '#6b7280',
                    background: active ? '#eff6ff' : 'transparent',
                    textDecoration: 'none', transition: 'all 0.15s',
                  }}>
                    {n.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '7px 14px', borderRadius: '7px',
              border: '1px solid #e5e7eb', background: '#fff',
              color: '#6b7280', fontSize: '13px', fontWeight: '500',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Log out
          </button>
        </div>
      </header>
      {children}
    </div>
  )
}
