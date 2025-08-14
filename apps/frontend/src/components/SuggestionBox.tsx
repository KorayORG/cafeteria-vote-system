'use client'

import { useState } from 'react'
import { api } from '../lib/api'
import { motion } from 'framer-motion'

export function SuggestionBox() {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
    const [focus, setFocus] = useState(false);

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
      <motion.form
        initial={{ opacity:0, y:16 }}
        animate={{ opacity:1, y:0 }}
        transition={{ type:'spring', stiffness: 80, damping: 18 }}
        onSubmit={e => {
          e.preventDefault();
          submit();
        }}
        className="card p-4 flex flex-col gap-3 shadow-lg bg-white/70 backdrop-blur-md"
      >
        <h2 className="text-xl font-semibold mb-3">İstek / Öneri</h2>
        <motion.textarea
          className="w-full min-h-[90px] rounded-2xl border border-white/10 bg-white/5 p-3 outline-none transition-all duration-200"
          maxLength={300}
          value={text}
          onChange={(e)=>setText(e.target.value)}
          onFocus={()=>setFocus(true)}
          onBlur={()=>setFocus(false)}
          placeholder="300 karaktere kadar yazabilirsiniz…"
          initial={false}
          animate={focus ? { scale:1.02, boxShadow:'0 0 0 2px #fb923c55' } : { scale:1, boxShadow:'none' }}
        />
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-sm ${text.length > 300 ? 'text-red-500' : 'text-gray-400'}`}>{300 - text.length} karakter kaldı</span>
          <motion.button
            className="btn btn-primary"
            type="submit"
            whileHover={{ scale: 1.06, boxShadow: '0 2px 16px #fb923c33' }}
            whileTap={{ scale: 0.97 }}
            disabled={sending}
          >
            {sending ? 'Gönderiliyor…' : 'Gönder'}
          </motion.button>
        </div>
      </motion.form>
  )
}
