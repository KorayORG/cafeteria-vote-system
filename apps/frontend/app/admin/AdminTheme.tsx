'use client'
import { useEffect, useState } from 'react'
import { api } from 'src/lib/api'

type Settings = { siteTitle:string; maintenanceMode:boolean; themeCode:string }

export default function AdminTheme() {
  const [s, setS] = useState<Settings | null>(null)

  const load = async () => {
    const res = await api('/admin/settings')
    setS(await res.json())
  }
  useEffect(()=>{ load() }, [])

  if (!s) return <div>Yükleniyor…</div>

  const saveTitle = async () => {
    await api('/admin/settings/title', { method: 'PATCH', body: { siteTitle: s.siteTitle } } as any)
  }
  const toggleMaint = async () => {
    const next = !s.maintenanceMode
    setS({...s, maintenanceMode: next})
    await api('/admin/settings/maintenance', { method: 'PATCH', body: { maintenanceMode: next } } as any)
  }
  const setTheme = async (themeCode: string) => {
    setS({...s, themeCode})
    await api('/admin/settings/theme', { method: 'PATCH', body: { themeCode } } as any)
  }

  return (
    <div className="grid gap-4">
      <div className="card grid md:grid-cols-[1fr_auto] gap-2 items-end">
        <div>
          <label className="text-sm text-gray-600">Site Başlığı</label>
          <input value={s.siteTitle} onChange={e=>setS({...s, siteTitle:e.target.value})} />
        </div>
        <button className="btn btn-primary" onClick={saveTitle}>Kaydet</button>
      </div>

      <div className="card flex items-center justify-between">
        <div>
          <div className="font-medium">Bakım Modu</div>
          <div className="text-gray-600 text-sm">Açıkken Admin dışı giriş kapalıdır.</div>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={s.maintenanceMode} onChange={toggleMaint} />
          <span>{s.maintenanceMode ? 'Açık' : 'Kapalı'}</span>
        </label>
      </div>

      <div className="card">
        <div className="font-medium mb-2">Tema</div>
        <div className="flex gap-2">
          {['default','bayram','ozel'].map(code=>(
            <button key={code} className={`btn ${s.themeCode===code?'btn-primary':'btn-secondary'}`} onClick={()=>setTheme(code)}>
              {code}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
