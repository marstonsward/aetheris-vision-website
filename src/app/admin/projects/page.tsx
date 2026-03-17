'use client'

import { useEffect, useState } from 'react'

const dark = {
  surface: '#0d1b2e',
  surfaceAlt: 'rgba(255,255,255,0.03)',
  border: 'rgba(255,255,255,0.08)',
  text: '#f1f5f9',
  textMuted: 'rgba(255,255,255,0.5)',
  textDim: 'rgba(255,255,255,0.25)',
  blue: '#3b82f6',
  blueDeep: '#1e3a5f',
  activeNav: 'rgba(59,130,246,0.15)',
  successText: '#6ee7b7',
}

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
    padding: '7px 10px', borderRadius: '6px',
    border: `1px solid ${dark.border}`,
    fontSize: '13px', color: dark.text,
    background: 'rgba(255,255,255,0.04)',
    outline: 'none', width: '100%', boxSizing: 'border-box',
    colorScheme: 'dark',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: '600',
    color: dark.textDim, marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.08em',
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: dark.text, marginBottom: '4px' }}>
        Project Timelines
      </h1>
      <p style={{ color: dark.textMuted, marginBottom: '32px', fontSize: '14px' }}>
        Set the current phase and milestone dates for each project. Clients see this on their dashboard.
      </p>

      {loading ? <p style={{ color: dark.textMuted }}>Loading…</p> : projects.length === 0 ? (
        <p style={{ color: dark.textDim }}>No projects yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {projects.map(p => (
            <div key={p.id} style={{ background: dark.surface, borderRadius: '12px', border: `1px solid ${dark.border}`, padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <p style={{ fontWeight: '700', color: dark.text, margin: '0 0 2px', fontSize: '16px' }}>{p.name}</p>
                  <p style={{ color: dark.textMuted, fontSize: '13px', margin: 0 }}>{p.client_name}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {saved === p.id && (
                    <span style={{ color: dark.successText, fontSize: '13px' }}>Saved ✓</span>
                  )}
                  <button
                    onClick={() => handleSave(p)}
                    disabled={saving === p.id}
                    style={{
                      padding: '8px 18px', borderRadius: '8px',
                      background: saving === p.id ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg, #2563eb, #3b82f6)',
                      color: '#fff', fontWeight: '600', fontSize: '13px', border: 'none', cursor: 'pointer',
                      boxShadow: saving === p.id ? 'none' : '0 4px 12px rgba(59,130,246,0.3)',
                    }}
                  >
                    {saving === p.id ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Current phase selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Current Phase</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PHASES.map(ph => {
                    const active = (getField(p, 'current_phase') || p.current_phase) === ph.key
                    return (
                      <button
                        key={ph.key}
                        onClick={() => setField(p.id, 'current_phase', ph.key)}
                        style={{
                          padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500',
                          border: `1.5px solid ${active ? dark.blue : dark.border}`,
                          background: active ? dark.activeNav : 'rgba(255,255,255,0.03)',
                          color: active ? dark.blue : dark.textMuted,
                          cursor: 'pointer', transition: 'all 0.15s',
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
                <label style={labelStyle}>Milestone Dates</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                  {PHASES.map(ph => (
                    <div key={ph.key}>
                      <label style={{ display: 'block', fontSize: '12px', color: dark.textDim, marginBottom: '4px' }}>{ph.label}</label>
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
