'use client'

import { useState, useEffect } from 'react'
import DatePicker from '../components/DatePicker'

const dark = {
  surface: '#0d1b2e',
  surfaceAlt: 'rgba(255,255,255,0.03)',
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.05)',
  text: '#f1f5f9',
  textMuted: 'rgba(255,255,255,0.5)',
  textDim: 'rgba(255,255,255,0.25)',
  blue: '#3b82f6',
  blueTag: 'rgba(59,130,246,0.15)',
  blueTagText: '#93c5fd',
}

const CATEGORIES = [
  'Software Subscriptions',
  'Cloud Services',
  'Domain & Hosting',
  'Design Tools',
  'Contractors & Subcontractors',
  'Legal & Professional Fees',
  'Professional Certifications',
  'Professional Development & Training',
  'Conferences & Events',
  'Books & Research Materials',
  'Marketing & Advertising',
  'Business Insurance',
  'Banking & Financial Fees',
  'Equipment & Hardware',
  'Office Supplies',
  'Travel & Transportation',
  'Other',
]

type Expense = {
  id: number
  date: string
  vendor: string
  description: string
  category: string
  amount: string
  tax_year: number
  receipt_url?: string
}

type CategoryTotal = {
  category: string
  total: string
}

const currentYear = new Date().getFullYear()
const TAX_YEARS = [currentYear, currentYear - 1, currentYear - 2]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [totals, setTotals] = useState<CategoryTotal[]>([])
  const [taxYear, setTaxYear] = useState(currentYear)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    description: '',
    category: CATEGORIES[0],
    amount: '',
    tax_year: currentYear,
    receipt_url: '',
  })

  async function fetchExpenses() {
    const res = await fetch(`/api/expenses?tax_year=${taxYear}`)
    const data = await res.json()
    setExpenses(data.expenses)
    setTotals(data.totals)
  }

  useEffect(() => { fetchExpenses() }, [taxYear])

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setSubmitting(true)
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, tax_year: taxYear }),
    })
    setForm({ ...form, vendor: '', description: '', amount: '', receipt_url: '' })
    setShowForm(false)
    setSubmitting(false)
    fetchExpenses()
  }

  const grandTotal = totals.reduce((sum, t) => sum + parseFloat(t.total), 0)

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: `1px solid ${dark.border}`, borderRadius: '7px',
    padding: '9px 12px', fontSize: '14px',
    color: dark.text, background: 'rgba(255,255,255,0.04)', outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: '600',
    color: dark.textDim, marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.07em',
  }

  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: dark.text, margin: '0 0 4px' }}>Expenses</h1>
            <p style={{ color: dark.textMuted, fontSize: '13px', margin: 0 }}>Aetheris Vision LLC — Tax Records</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              value={taxYear}
              onChange={e => setTaxYear(Number(e.target.value))}
              style={{
                border: `1px solid ${dark.border}`, borderRadius: '7px',
                padding: '8px 12px', fontSize: '14px',
                color: dark.text, background: dark.surface, outline: 'none',
                colorScheme: 'dark',
              }}
            >
              {TAX_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: '#fff', padding: '9px 16px', borderRadius: '8px',
                fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
              }}
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{
            background: dark.surface, border: `1px solid ${dark.border}`,
            borderRadius: '12px', padding: '24px', marginBottom: '24px',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
          }}>
            <div>
              <label style={labelStyle}>Date</label>
              <DatePicker
                required
                value={form.date}
                onChange={date => setForm({ ...form, date })}
              />
            </div>
            <div>
              <label style={labelStyle}>Vendor</label>
              <input type="text" required placeholder="e.g. GitHub" value={form.vendor}
                onChange={e => setForm({ ...form, vendor: e.target.value })}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <input type="text" required placeholder="e.g. Annual Pro plan" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ ...inputStyle, colorScheme: 'dark' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Amount ($)</label>
              <input type="number" required step="0.01" min="0" placeholder="0.00" value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Receipt URL (optional)</label>
              <input type="url" placeholder="https://..." value={form.receipt_url}
                onChange={e => setForm({ ...form, receipt_url: e.target.value })}
                style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setShowForm(false)}
                style={{ padding: '9px 16px', fontSize: '14px', color: dark.textMuted, background: 'transparent', border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                style={{
                  background: submitting ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  color: '#fff', padding: '9px 18px', borderRadius: '8px',
                  fontSize: '14px', fontWeight: '600', border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                }}>
                {submitting ? 'Saving...' : 'Save Expense'}
              </button>
            </div>
          </form>
        )}

        {/* Category Totals */}
        {totals.length > 0 && (
          <div style={{ background: dark.surface, border: `1px solid ${dark.border}`, borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '700', color: dark.textDim, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              {taxYear} Summary
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              {totals.map(t => (
                <div key={t.category} style={{ background: dark.surfaceAlt, borderRadius: '8px', padding: '12px', border: `1px solid ${dark.borderLight}` }}>
                  <p style={{ fontSize: '11px', color: dark.textDim, margin: '0 0 4px' }}>{t.category}</p>
                  <p style={{ fontSize: '17px', fontWeight: '700', color: dark.text, margin: 0 }}>${parseFloat(t.total).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${dark.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', color: dark.textMuted, fontSize: '14px' }}>Total {taxYear}</span>
              <span style={{ fontWeight: '800', color: dark.text, fontSize: '20px' }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Expenses Table */}
        <div style={{ background: dark.surface, border: `1px solid ${dark.border}`, borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${dark.border}` }}>
                {['Date', 'Vendor', 'Description', 'Category', 'Amount'].map((h, i) => (
                  <th key={h} style={{
                    textAlign: i === 4 ? 'right' : 'left',
                    padding: '12px 16px', fontSize: '11px', fontWeight: '700',
                    color: dark.textDim, textTransform: 'uppercase', letterSpacing: '0.08em',
                    background: dark.surfaceAlt,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: dark.textDim }}>
                    No expenses logged for {taxYear}
                  </td>
                </tr>
              )}
              {expenses.map((e, i) => (
                <tr key={e.id} style={{ borderTop: i === 0 ? 'none' : `1px solid ${dark.borderLight}` }}>
                  <td style={{ padding: '12px 16px', color: dark.textMuted }}>{new Date(e.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: dark.text }}>{e.vendor}</td>
                  <td style={{ padding: '12px 16px', color: dark.textMuted }}>{e.description}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: dark.blueTag, color: dark.blueTagText,
                      padding: '3px 9px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                    }}>{e.category}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: dark.text }}>${parseFloat(e.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
