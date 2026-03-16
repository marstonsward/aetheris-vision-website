'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function LoginForm() {
  const params = useSearchParams()
  const sent = params.get('sent') === '1'
  const error = params.get('error') === '1'

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await signIn('email', { email, callbackUrl: '/client/dashboard', redirect: false })
    // NextAuth will redirect to /client/login?sent=1
    window.location.href = '/client/login?sent=1'
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo / brand */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 4px' }}>
            Aetheris Vision LLC
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Client Portal</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>📧</div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>
                Check your email
              </h2>
              <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>
                A login link has been sent to <strong>{email || 'your email address'}</strong>.
                Click the link in the email to log in — it expires in 24 hours.
              </p>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '16px' }}>
                Don&apos;t see it? Check your spam folder.
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: '0 0 8px' }}>
                Log in
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px' }}>
                Enter your email and we&apos;ll send you a secure login link — no password needed.
              </p>

              {error && (
                <p style={{ color: '#dc2626', fontSize: '14px', marginBottom: '16px', padding: '10px 12px', background: '#fef2f2', borderRadius: '6px' }}>
                  That link is invalid or expired. Please request a new one.
                </p>
              )}

              <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    display: 'block', width: '100%', boxSizing: 'border-box',
                    padding: '10px 12px', borderRadius: '6px',
                    border: '1px solid #d1d5db', fontSize: '15px',
                    color: '#111827', background: '#fff', marginBottom: '16px',
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '6px',
                    background: loading ? '#93c5fd' : '#1e3a5f',
                    color: '#fff', fontWeight: '600', fontSize: '15px',
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Sending…' : 'Send login link'}
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', marginTop: '24px' }}>
          Questions? Email{' '}
          <a href="mailto:marston@aetherisvision.com" style={{ color: '#1e3a5f' }}>
            marston@aetherisvision.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default function ClientLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
