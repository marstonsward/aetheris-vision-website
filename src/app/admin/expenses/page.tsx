'use client'

import { useState, useEffect } from 'react'
import DatePicker from '../components/DatePicker'

const CATEGORIES = [
  // Recurring digital costs
  'Software Subscriptions',
  'Cloud Services',
  'Domain & Hosting',
  'Design Tools',
  // People
  'Contractors & Subcontractors',
  'Legal & Professional Fees',
  // Growth & credentials
  'Professional Certifications',
  'Professional Development & Training',
  'Conferences & Events',
  'Books & Research Materials',
  // Business ops
  'Marketing & Advertising',
  'Business Insurance',
  'Banking & Financial Fees',
  // Physical
  'Equipment & Hardware',
  'Office Supplies',
  'Travel & Transportation',
  // Catch-all
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-500 text-sm mt-1">Aetheris Vision LLC — Tax Records</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={taxYear}
              onChange={e => setTaxYear(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white"
            >
              {TAX_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <DatePicker
                required
                value={form.date}
                onChange={date => setForm({ ...form, date })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <input type="text" required placeholder="e.g. GitHub" value={form.vendor}
                onChange={e => setForm({ ...form, vendor: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" required placeholder="e.g. Annual Pro plan" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input type="number" required step="0.01" min="0" placeholder="0.00" value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receipt URL (optional)</label>
              <input type="url" placeholder="https://..." value={form.receipt_url}
                onChange={e => setForm({ ...form, receipt_url: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white" />
            </div>
            <div className="col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
              <button type="submit" disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Expense'}
              </button>
            </div>
          </form>
        )}

        {/* Category Totals */}
        {totals.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              {taxYear} Summary
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {totals.map(t => (
                <div key={t.category} className="bg-gray-50 rounded-md p-3">
                  <p className="text-xs text-gray-500">{t.category}</p>
                  <p className="text-lg font-semibold text-gray-900">${parseFloat(t.total).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
              <span className="font-semibold text-gray-700">Total {taxYear}</span>
              <span className="font-bold text-gray-900 text-lg">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Expenses Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Vendor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No expenses logged for {taxYear}</td></tr>
              )}
              {expenses.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{e.vendor}</td>
                  <td className="px-4 py-3 text-gray-600">{e.description}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{e.category}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">${parseFloat(e.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
