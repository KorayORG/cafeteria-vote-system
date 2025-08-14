'use client'
import { useEffect, useState } from 'react'
import { api } from 'src/lib/api'

type Shift = { _id:string; code:string; label:string; order:number; isActive:boolean }

export default function AdminShifts() {
  const [rows, setRows] = useState<Shift[]>([])
  const [form, setForm] = useState<Partial<Shift>>({ code:'', label:'', order: rows.length })

  const load = async () => {
    const res = await api('/admin/shifts')
    setRows(await res.json())
  }
  useEffect(()=>{ load() }, [])

  const create = async () => {
    await api('/admin/shifts', { method: 'POST', body: form } as any)
    setForm({ code:'', label:'', order: rows.length })
    load()
  }
  const update = async (id: string, patch: Partial<Shift>) => {
    await api(`/admin/shifts/${id}`, { method: 'PATCH', body: patch } as any)
    load()
  }
  const remove = async (id: string) => {
    await api(`/admin/shifts/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="grid gap-4">
      <div className="card grid md:grid-cols-[1fr_1fr_auto] gap-2 items-end">
        <input placeholder="Kod (08:00-16:00)" value={form.code||''} onChange={e=>setForm(f=>({...f, code:e.target.value}))} />
        <input placeholder="Etiket" value={form.label||''} onChange={e=>setForm(f=>({...f, label:e.target.value}))} />
        <button className="btn btn-primary" onClick={create}>Ekle</button>
      </div>

      <div className="card">
        <div className="space-y-2">
          {rows.map(s=>(
            <div key={s._id} className="flex flex-wrap items-center gap-2 border rounded-lg p-2">
              <input className="w-40" value={s.code} onChange={e=>update(s._id, { code: e.target.value })} />
              <input className="flex-1" value={s.label} onChange={e=>update(s._id, { label: e.target.value })} />
              <label className="flex items-center gap-1 text-sm">
                <input type="checkbox" checked={s.isActive} onChange={e=>update(s._id, { isActive: e.target.checked })} />
                Aktif
              </label>
              <button className="btn btn-secondary" onClick={()=>remove(s._id)}>Sil</button>
            </div>
          ))}
          {rows.length===0 && <div className="text-sm text-gray-500">Vardiya yok.</div>}
        </div>
      </div>
    </div>
  )
}
