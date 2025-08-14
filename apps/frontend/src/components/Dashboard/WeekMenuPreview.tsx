'use client'

import { useEffect, useState } from 'react'
import { getJSON, isoWeekOf } from '../../lib/api'
import { motion } from 'framer-motion'

type Dish = { name: string; imageUrl?: string; tags?: string[] }
type DayMenu = { date: string; traditional: Dish; alternative: Dish }
type WeekMenu = { weekOfISO: string; days: DayMenu[] }

export default function WeekMenuPreview() {
  const [data, setData] = useState<WeekMenu | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const w = isoWeekOf()
    getJSON<WeekMenu>(`/menu/week/${w}`)
      .then(setData)
      .catch(async () => {
        // opsiyonel fallback: /current uç varsa dene
        try {
          const d = await getJSON<WeekMenu>(`/menu/week/current`)
          setData(d)
        } catch (e: any) {
          setErr(e?.message || 'Menü alınamadı')
        }
      })
  }, [])

  if (err) return <div className="card p-4 text-red-600">{err}</div>
  if (!data) return <div className="card p-4">Menü yükleniyor…</div>

  return (
    <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} className="card">
      <h2 className="text-xl font-semibold mb-3">Haftalık Yemek Listesi</h2>
      <ul className="grid sm:grid-cols-2 gap-3">
        {data.days?.map((d) => (
          <li key={d.date} className="rounded-xl border border-white/10 p-3 bg-white/5">
            <div className="text-sm text-gray-500 mb-2">
              {new Date(d.date).toLocaleDateString('tr-TR', { weekday:'long', day:'2-digit', month:'2-digit' })}
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="font-medium">Geleneksel</div>
                <div className="text-gray-200">{d.traditional?.name ?? '-'}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(d.traditional?.tags ?? []).map(t => (
                    <span key={t} className="badge badge-orange">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="font-medium">Alternatif</div>
                <div className="text-gray-200">{d.alternative?.name ?? '-'}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(d.alternative?.tags ?? []).map(t => (
                    <span key={t} className="badge badge-green">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
