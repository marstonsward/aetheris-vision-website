'use client'

import { useEffect, useState } from 'react'

interface Client {
  id: number
  name: string
  contact_name: string
  email: string
  phone: string | null
  created_at: string
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [inviting, setInviting] = useState<number | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [form, setForm] = useState({ name: '', contact_name: '', email: '', phone: '' })

  useEffect(() => { fetchClients() }, [])

  async function fetchClients() {
    const r = await fetch('/api/admin/clients')
    const data = await r.json()
    setClients(data.clients ?? [])
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ name: '', contact_name: '', email: '', phone: '' })
    setSaving(false)
    fetchClients()
  }

  async function handleInvite(clientId: number, email: string) {
    setInviting(clientId)
    await fetch('/api/admin/clients/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setInviting(null)
    setSuccessMsg(`Login link sent to ${email}`)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  async function handleViewAs(clientId: number) {
    await fetch('/api/admin/clients/impersonate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId }),
    })
    window.open('/client/dashboard', '_blank')
  }

  const inputStyle: React.CSSProperties = {
    display: 'block', width: '100%', boxSizing: 'border-box',
    padding: '9px 12px', borderRadius: '6px',
    border: '1px solid #d1d5db', fontSize: '14px',
    color: '#111827', background: '#fff',
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
        Client Management
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>
        Add clients here to give them access to the client portal.
        Use &quot;Send invite&quot; to email them a login link.
      </p>

      {/* Add client form */}
      <div style={{ background: '#fff', borderRadius: '10px', padding: '24px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Add New Client</h2>
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Business name *</label>
            <input required style={inputStyle} value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Contact name *</label>
            <input required style={inputStyle} value={form.contact_name}
              onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Email address *</label>
            <input required type="email" style={inputStyle} value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Phone</label>
            <input type="tel" style={inputStyle} value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button
              type="submit"
              disabled={saving}
              style={{ padding: '10px 20px', borderRadius: '6px', background: saving ? '#93c5fd' : '#1e3a5f', color: '#fff', fontWeight: '600', fontSize: '14px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Saving…' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>

      {successMsg && (
        <div style={{ background: '#d1fae5', color: '#065f46', padding: '10px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
          {successMsg}
        </div>
      )}

      {/* Client list */}
      <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>Clients</h2>
      {loading ? (
        <p style={{ color: '#64748b' }}>Loading…</p>
      ) : clients.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No clients yet. Add one above.</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {clients.map((c, i) => (
            <div key={c.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', flexWrap: 'wrap', gap: '8px',
              borderTop: i === 0 ? 'none' : '1px solid #f1f5f9',
            }}>
              <div>
                <p style={{ fontWeight: '600', color: '#0f172a', margin: '0 0 2px', fontSize: '15px' }}>{c.name}</p>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>{c.contact_name} · {c.email}{c.phone ? ` · ${c.phone}` : ''}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleViewAs(c.id)}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#f8fafc', color: '#374151', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
                >
                  View as client
                </button>
                <button
                  onClick={() => handleInvite(c.id, c.email)}
                  disabled={inviting === c.id}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', color: '#374151', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
                >
                  {inviting === c.id ? 'Sending…' : 'Send invite'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
