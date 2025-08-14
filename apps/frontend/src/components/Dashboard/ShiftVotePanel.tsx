'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

type Shift = { code: 'D'|'E'|'N'; label: string; time: string }
const SHIFTS: Shift[] = [
  { code:'D', label:'Gündüz',  time:'08:00 - 16:00' },
  { code:'E', label:'Akşam',   time:'16:00 - 00:00' },
  { code:'N', label:'Gece',    time:'00:00 - 08:00' },
]

export default function ShiftVotePanel() {
  const router = useRouter()
  return (
    <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} className="card">
      <h2 className="text-xl font-semibold mb-3">Tercih Yap</h2>
      <p className="text-gray-600 mb-3">Vardiyanızı seçin ve o hafta için oyunuzu verin.</p>
      <div className="grid sm:grid-cols-3 gap-3">
        {SHIFTS.map(s => (
          <button
            key={s.code}
            className="group rounded-2xl border border-white/10 p-4 bg-gradient-to-b from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/[0.06] transition"
            onClick={() => router.push(`/vote?shift=${s.code}`)}
          >
            <div className="text-lg font-semibold">{s.label}</div>
            <div className="text-sm text-gray-400">{s.time}</div>
            <div className="mt-3">
              <span className="badge badge-green mr-2">Alternatif</span>
              <span className="badge badge-orange">Geleneksel</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
