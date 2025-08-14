'use client'
const SHIFTS = [
  { code: '08:00-16:00', label: '08:00 - 16:00' },
  { code: '16:00-00:00', label: '16:00 - 00:00' },
  { code: '00:00-08:00', label: '00:00 - 08:00' },
] as const

export function ShiftSelector({ value, onChange }: { value?: string; onChange: (v: string)=>void }) {
  return (
    <div className="grid md:grid-cols-3 gap-3">
      {SHIFTS.map(s => (
        <button
          key={s.code}
          type="button"
          onClick={() => onChange(s.code)}
          className={`card text-center py-6 ${value===s.code ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="text-xl font-semibold">{s.label}</div>
        </button>
      ))}
    </div>
  )
}
