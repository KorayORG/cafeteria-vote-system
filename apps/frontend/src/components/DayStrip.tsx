'use client'
import { WEEK_DAYS } from '../lib/date'

export function DayStrip({ current, onPick }: { current: string; onPick: (d: string)=>void }) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {WEEK_DAYS.map(d => (
        <button
          key={d}
          className={`px-3 py-1 rounded-full border ${current===d ? 'bg-gray-900 text-white' : 'bg-white'}`}
          onClick={() => onPick(d)}
          type="button"
        >
          {d}
        </button>
      ))}
    </div>
  )
}
