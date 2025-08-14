'use client'

import { useEffect, useState } from 'react'
import { fetchMe, hasUsers } from '../../lib/auth'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

type Mode = 'loading' | 'login' | 'register' | 'ok'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('loading')

  const recheck = async () => {
    const me = await fetchMe()
    if (me.ok) setMode('ok')
    else {
      const anyUser = await hasUsers()
      setMode(anyUser ? 'login' : 'register')
    }
  }

  useEffect(() => { recheck() }, [])

  if (mode === 'loading') return <div className="p-6">Yükleniyor…</div>
  if (mode === 'ok') return <>{children}</>

  return (
    <div className="min-h-[70vh] grid place-items-center p-6">
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">
            {mode === 'login' ? 'Giriş Yap' : 'İlk Kullanıcı Kaydı'}
          </h1>
          <div className="text-sm text-gray-600">
            {mode === 'login'
              ? <button className="underline" onClick={()=>setMode('register')}>Kayıt Ol</button>
              : <button className="underline" onClick={()=>setMode('login')}>Giriş</button>}
          </div>
        </div>

        {mode === 'login'
          ? <LoginForm onSuccess={recheck} />
          : <RegisterForm onSuccess={recheck} />
        }
      </div>
    </div>
  )
}
