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
          <motion.button
            className="btn"
            onClick={() => router.push('/kitchen')}
            whileHover={{ scale: 1.07, boxShadow: '0 2px 16px #22d3ee33' }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity:0, y:8 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay: 0.04 }}
          >
            Mutfak Paneli
          </motion.button>
        )}
        {role === 'Admin' && (
          <>
            <motion.button
              className="btn"
              onClick={() => router.push('/admin/users')}
              whileHover={{ scale: 1.07, boxShadow: '0 2px 16px #fbbf24aa' }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity:0, y:8 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: 0.08 }}
            >Kullanıcı Yönetimi</motion.button>
            <motion.button
              className="btn"
              onClick={() => router.push('/admin/shifts')}
              whileHover={{ scale: 1.07, boxShadow: '0 2px 16px #34d399aa' }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity:0, y:8 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: 0.12 }}
            >Vardiya Yönetimi</motion.button>
            <motion.button
              className="btn"
              onClick={() => router.push('/admin/themes')}
              whileHover={{ scale: 1.07, boxShadow: '0 2px 16px #818cf8aa' }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity:0, y:8 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: 0.16 }}
            >Tema Yönetimi</motion.button>
          </>
        )}
      </div>
    </motion.div>
  )
}
