'use client'

import { useEffect, useRef } from 'react'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'

type Props = {
  value: string
  onChange: (date: string) => void
  required?: boolean
}

export default function DatePicker({ value, onChange, required }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const fpRef = useRef<flatpickr.Instance | null>(null)

  useEffect(() => {
    if (!inputRef.current) return
    fpRef.current = flatpickr(inputRef.current, {
      dateFormat: 'Y-m-d',
      defaultDate: value,
      onChange: ([date]) => {
        if (date) onChange(date.toISOString().split('T')[0])
      },
    })
    return () => fpRef.current?.destroy()
  }, [])

  useEffect(() => {
    if (fpRef.current && value) fpRef.current.setDate(value, false)
  }, [value])

  return (
    <input
      ref={inputRef}
      required={required}
      readOnly
      placeholder="Select date"
      style={{
        width: '100%', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '6px', padding: '7px 10px',
        fontSize: '13px', color: '#f1f5f9',
        background: 'rgba(255,255,255,0.04)', cursor: 'pointer',
        outline: 'none', boxSizing: 'border-box',
      }}
    />
  )
}
