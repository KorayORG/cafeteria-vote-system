'use client'

import { useEffect, useState } from 'react'
import { getJSON } from '../lib/api'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function RoleQuickActions() {
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    getJSON<{ user:{ id:string; role:string } }>('/auth/me')
      .then(({ user }) => setRole(user?.role ?? null))
      .catch(() => setRole(null))
  }, [])

  if (!role || role === 'Üye') return null

  return (
    <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} className="card">
      <h2 className="text-xl font-semibold mb-3">Hızlı İşlemler</h2>
      <div className="flex flex-wrap gap-3">
        {(role === 'Mutfak' || role === 'Admin') && (
          <button className="btn" onClick={() => router.push('/kitchen')}>
            Mutfak Paneli
          </button>
        )}
        {role === 'Admin' && (
          <>
            <button className="btn" onClick={() => router.push('/admin/users')}>Kullanıcı Yönetimi</button>
            <button className="btn" onClick={() => router.push('/admin/shifts')}>Vardiya Yönetimi</button>
            <button className="btn" onClick={() => router.push('/admin/themes')}>Tema Yönetimi</button>
          </>
        )}
      </div>
    </motion.div>
  )
}
