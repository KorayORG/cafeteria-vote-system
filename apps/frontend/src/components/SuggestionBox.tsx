'use client'

import { useState } from 'react'
import { api } from '../lib/api'
import { motion } from 'framer-motion'

export function SuggestionBox() {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const left = 300 - text.length

  const submit = async () => {
    if (!text.trim()) return alert('Lütfen bir mesaj yazın.')
    if (text.length > 300) return alert('En fazla 300 karakter.')
    setSending(true)
    const res = await api('/suggestions', { method:'POST', body:{ text } } as any)
    setSending(false)
    if (res.ok) {
      setText('')
      alert('Mesajınız iletildi.')
    } else {
      const j = await res.json().catch(()=>({}))
      alert(j?.message || 'Gönderilemedi')
    }
  }

  return (
    <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} className="card">
      <h2 className="text-xl font-semibold mb-3">İstek / Öneri</h2>
      <textarea
        className="w-full min-h-[90px] rounded-2xl border border-white/10 bg-white/5 p-3 outline-none"
        maxLength={300}
        value={text}
        onChange={(e)=>setText(e.target.value)}
        placeholder="300 karaktere kadar yazabilirsiniz…"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-sm ${left<0?'text-red-500':'text-gray-400'}`}>{left} karakter kaldı</span>
        <button className="btn btn-primary" onClick={submit} disabled={sending}>
          {sending ? 'Gönderiliyor…' : 'Gönder'}
        </button>
      </div>
    </motion.div>
  )
}
