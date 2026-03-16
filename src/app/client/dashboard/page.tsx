'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Project {
  id: number
  name: string
  status: string
  start_date: string | null
  signed_at: string | null
  docuseal_submission_id: string | null
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  active:  { label: 'In Progress',    color: '#1d4ed8', bg: '#dbeafe' },
  signed:  { label: 'Signed',         color: '#065f46', bg: '#d1fae5' },
  pending: { label: 'Awaiting Signature', color: '#92400e', bg: '#fef3c7' },
  closed:  { label: 'Closed',         color: '#374151', bg: '#f3f4f6' },
}

export default function ClientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.replace('/client/login'); return }
    fetch('/api/client/projects')
      .then(r => r.json())
      .then(data => { setProjects(data.projects ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [session, status, router])

  if (status === 'loading' || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#64748b' }}>Loading…</p>
      </div>
    )
  }

  const clientName = session?.user?.name ?? 'Client'

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 4px' }}>
            Aetheris Vision LLC
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>Welcome, {clientName}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/client/login' })}
          style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', color: '#374151', fontSize: '14px', cursor: 'pointer' }}
        >
          Log out
        </button>
      </div>

      {/* Projects */}
      <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
        Your Projects
      </h2>

      {projects.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '10px', padding: '32px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', margin: 0 }}>No projects yet. Your documents will appear here once they&apos;re ready.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {projects.map(p => {
            const s = STATUS_LABEL[p.status] ?? STATUS_LABEL.active
            return (
              <div key={p.id} style={{ background: '#fff', borderRadius: '10px', padding: '20px 24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#0f172a', margin: '0 0 6px', fontSize: '16px' }}>{p.name}</p>
                  {p.start_date && (
                    <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                      Started {new Date(p.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                  {p.signed_at && (
                    <p style={{ color: '#64748b', fontSize: '13px', margin: '2px 0 0' }}>
                      Signed {new Date(p.signed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', color: s.color, background: s.bg }}>
                    {s.label}
                  </span>
                  {p.docuseal_submission_id && p.status !== 'signed' && (
                    <a
                      href={`https://docuseal.com/s/${p.docuseal_submission_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: '8px 14px', borderRadius: '6px', background: '#1e3a5f', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
                    >
                      Sign document
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '40px', textAlign: 'center' }}>
        Questions? Contact{' '}
        <a href="mailto:marston@aetherisvision.com" style={{ color: '#1e3a5f' }}>marston@aetherisvision.com</a>
      </p>
    </div>
  )
}
