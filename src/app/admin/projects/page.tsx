'use client'

import { useEffect, useState } from 'react'

const PHASES = [
  { key: 'kickoff', label: 'Kickoff', dateField: 'phase_kickoff_date' },
  { key: 'design', label: 'Design', dateField: 'phase_design_date' },
  { key: 'development', label: 'Development', dateField: 'phase_development_date' },
  { key: 'review', label: 'Review', dateField: 'phase_review_date' },
  { key: 'launched', label: 'Launched', dateField: 'phase_launched_date' },
]

interface Project {
  id: number
  name: string
  client_name: string
  current_phase: string
  phase_kickoff_date: string | null
  phase_design_date: string | null
  phase_development_date: string | null
  phase_review_date: string | null
  phase_launched_date: string | null
}

function toDateInput(iso: string | null) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

function toIso(dateStr: string) {
  return dateStr ? new Date(dateStr).toISOString() : null
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [saved, setSaved] = useState<number | null>(null)
  const [edits, setEdits] = useState<Record<number, Partial<Project>>>({})

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then(d => { setProjects(d.projects ?? []); setLoading(false) })
  }, [])

  function getField(p: Project, field: string): string {
    const override = edits[p.id]
    if (override && field in override) return (override as Record<string, string>)[field] ?? ''
    return (p as unknown as Record<string, string>)[field] ?? ''
  }

  function setField(projectId: number, field: string, value: string) {
    setEdits(e => ({ ...e, [projectId]: { ...e[projectId], [field]: value } }))
  }

  async function handleSave(p: Project) {
    setSaving(p.id)
    const patch = { id: p.id, ...edits[p.id] }
    // Convert date fields to ISO
    for (const ph of PHASES) {
      const key = ph.dateField as keyof typeof patch
      if (patch[key]) patch[key] = toIso(patch[key] as string) as never
    }
    await fetch('/api/admin/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    setSaving(null)
    setSaved(p.id)
    setTimeout(() => setSaved(null), 2000)
  }

  const inputStyle: React.CSSProperties = {
    padding: '6px 8px', borderRadius: '5px', border: '1px solid #d1d5db',
    fontSize: '13px', color: '#111827', background: '#fff',
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
        Project Timelines
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>
        Set the current phase and milestone dates for each project. Clients see this on their dashboard.
      </p>

      {loading ? <p style={{ color: '#64748b' }}>Loading…</p> : projects.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No projects yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {projects.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <p style={{ fontWeight: '700', color: '#0f172a', margin: '0 0 2px', fontSize: '16px' }}>{p.name}</p>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>{p.client_name}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {saved === p.id && (
                    <span style={{ color: '#065f46', fontSize: '13px' }}>Saved ✓</span>
                  )}
                  <button
                    onClick={() => handleSave(p)}
                    disabled={saving === p.id}
                    style={{ padding: '8px 16px', borderRadius: '6px', background: saving === p.id ? '#93c5fd' : '#1e3a5f', color: '#fff', fontWeight: '600', fontSize: '13px', border: 'none', cursor: 'pointer' }}
                  >
                    {saving === p.id ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Current phase selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Current Phase
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PHASES.map(ph => {
                    const active = (getField(p, 'current_phase') || p.current_phase) === ph.key
                    return (
                      <button
                        key={ph.key}
                        onClick={() => setField(p.id, 'current_phase', ph.key)}
                        style={{
                          padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500',
                          border: `2px solid ${active ? '#1e3a5f' : '#d1d5db'}`,
                          background: active ? '#1e3a5f' : '#fff',
                          color: active ? '#fff' : '#374151',
                          cursor: 'pointer',
                        }}
                      >
                        {ph.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Milestone dates */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Milestone Dates
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                  {PHASES.map(ph => (
                    <div key={ph.key}>
                      <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{ph.label}</label>
                      <input
                        type="date"
                        style={inputStyle}
                        value={toDateInput(getField(p, ph.dateField) || (p as unknown as Record<string, string>)[ph.dateField])}
                        onChange={e => setField(p.id, ph.dateField, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
