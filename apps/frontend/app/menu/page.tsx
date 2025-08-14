'use client'
import { useEffect, useState } from 'react'
import { api } from 'src/lib/api'
import { weekStartISO } from 'src/lib/date'

export default function MenuPage() {
  const [data, setData] = useState<any>()

  useEffect(() => {
    const load = async () => {
      const ws = weekStartISO()
      const url = `/menu/week?start=${encodeURIComponent(ws)}`
      const res = await api(url)
      const j = await res.json()
      setData(j)
    }
    load()
  }, [])

  return (
    <div className="p-6 grid gap-4">
      <h1 className="text-2xl font-semibold">Haftalık Menü</h1>
      {!data && <div>Yükleniyor…</div>}
      {data && (
        <div className="grid gap-3">
          {data.meals?.map((m:any)=>(
            <div key={m.day} className="card">
              <div className="font-semibold">{m.day}</div>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <div><b>Geleneksel:</b> {m.traditional?.name || '-'}</div>
                <div><b>Alternatif:</b> {m.alternative?.name || '-'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
