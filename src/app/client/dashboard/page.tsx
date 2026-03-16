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
  current_phase: string | null
  phase_kickoff_date: string | null
  phase_design_date: string | null
  phase_development_date: string | null
  phase_review_date: string | null
  phase_launched_date: string | null
}

const PHASES = [
  { key: 'kickoff',     label: 'Kickoff',      dateField: 'phase_kickoff_date' as const },
  { key: 'design',      label: 'Design',        dateField: 'phase_design_date' as const },
  { key: 'development', label: 'Development',   dateField: 'phase_development_date' as const },
  { key: 'review',      label: 'Review',        dateField: 'phase_review_date' as const },
  { key: 'launched',    label: 'Launched',      dateField: 'phase_launched_date' as const },
]

function formatDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ProjectTimeline({ project }: { project: Project }) {
  const currentIdx = PHASES.findIndex(p => p.key === project.current_phase)

  return (
    <div style={{ marginTop: '24px' }}>
      <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
        Project Timeline
      </p>
      <div style={{ position: 'relative' }}>
        {/* Track line */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px', right: '12px', height: '2px',
          background: '#e2e8f0', zIndex: 0,
        }} />
        {/* Filled portion */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px', height: '2px', zIndex: 0,
          background: '#1e3a5f',
          width: currentIdx < 0 ? '0%' : `${(currentIdx / (PHASES.length - 1)) * (100 - (24 / (PHASES.length)))}%`,
          transition: 'width 0.3s',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          {PHASES.map((phase, idx) => {
            const done = idx < currentIdx
            const active = idx === currentIdx
            const date = formatDate(project[phase.dateField])

            return (
              <div key={phase.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                {/* Circle */}
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: done || active ? '#1e3a5f' : '#fff',
                  border: `2px solid ${done || active ? '#1e3a5f' : '#cbd5e1'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: active ? '0 0 0 4px #dbeafe' : 'none',
                  transition: 'all 0.2s',
                }}>
                  {done && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {active && (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
                  )}
                </div>

                {/* Label */}
                <p style={{
                  fontSize: '11px', fontWeight: active ? '700' : '500',
                  color: active ? '#1e3a5f' : done ? '#475569' : '#94a3b8',
                  margin: '6px 0 2px', textAlign: 'center', lineHeight: '1.2',
                }}>
                  {phase.label}
                </p>

                {/* Date */}
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, textAlign: 'center', lineHeight: '1.2' }}>
                  {date ?? (active ? 'In progress' : '')}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  active:  { label: 'In Progress',         color: '#1d4ed8', bg: '#dbeafe' },
  signed:  { label: 'Signed',              color: '#065f46', bg: '#d1fae5' },
  pending: { label: 'Awaiting Signature',  color: '#92400e', bg: '#fef3c7' },
  closed:  { label: 'Closed',              color: '#374151', bg: '#f3f4f6' },
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {projects.map(p => {
            const s = STATUS_LABEL[p.status] ?? STATUS_LABEL.active
            return (
              <div key={p.id} style={{ background: '#fff', borderRadius: '10px', padding: '24px', border: '1px solid #e2e8f0' }}>
                {/* Project header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <p style={{ fontWeight: '700', color: '#0f172a', margin: '0 0 4px', fontSize: '17px' }}>{p.name}</p>
                    {p.start_date && (
                      <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                        Started {new Date(p.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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

                {/* Timeline */}
                {p.current_phase && <ProjectTimeline project={p} />}
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
