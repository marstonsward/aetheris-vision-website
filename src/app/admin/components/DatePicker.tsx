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
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white cursor-pointer"
    />
  )
}
