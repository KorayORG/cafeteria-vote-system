"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getJSON, api } from '../lib/api'

export default function Navbar(){
  const [user, setUser] = useState<{fullName:string; role:string}|null>(null)

  useEffect(()=>{
    getJSON<{user:{fullName:string, role:string}}|null>('/auth/me')
      .then(r=> setUser(r?.user ?? null))
      .catch(()=> setUser(null))
  },[])

  const logout = async ()=>{
    await api('/auth/logout', { method:'POST' })
    location.href = '/login'
  }

  return (
    <header className="bg-white/60 backdrop-blur border-b border-black/5">
      <div className="container-p h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Cafeteria Vote System</Link>
        <div className="flex items-center gap-2">
          {user && (
            <span className="badge">{user.role}</span>
          )}
          {user ? (
            <button className="btn-ghost" onClick={logout}>Çıkış</button>
          ) : (
            <Link className="btn-ghost" href="/login">Giriş</Link>
          )}
        </div>
      </div>
    </header>
  )
}
