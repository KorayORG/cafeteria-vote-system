"use client";
import { motion } from 'framer-motion';
const SHIFTS = [
  { code: '08:00-16:00', label: '08:00 - 16:00' },
  { code: '16:00-00:00', label: '16:00 - 00:00' },
  { code: '00:00-08:00', label: '00:00 - 08:00' },
] as const

export function ShiftSelector({ value, onChange }: { value?: string; onChange: (v: string)=>void }) {
  return (
    <motion.div
      initial={{ opacity:0, y:12 }}
      animate={{ opacity:1, y:0 }}
      className="grid md:grid-cols-3 gap-3"
    >
      {SHIFTS.map((s, i) => (
        <motion.button
          key={s.code}
          type="button"
          onClick={() => onChange(s.code)}
          className={`card text-center py-6 ${value===s.code ? 'ring-2 ring-blue-500' : ''}`}
          whileHover={{ scale: 1.06, boxShadow: '0 2px 16px #fb923c33' }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity:0, y:8 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay: i*0.04 }}
        >
          <div className="text-xl font-semibold">{s.label}</div>
        </motion.button>
      ))}
    </motion.div>
  )
}
