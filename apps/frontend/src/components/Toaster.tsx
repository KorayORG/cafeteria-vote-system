"use client"
import { useAtom } from 'jotai'
import { atom } from 'jotai'
import { useEffect } from 'react'

type Toast = { id:number; text:string; type?:'success'|'error' }
export const toastsAtom = atom<Toast[]>([])

export function toast(text: string, type?: 'success'|'error') {
  const id = Date.now()
  ;(window as any).__pushToast?.({ id, text, type })
  return id
}

export function Toaster(){
  const [toasts, setToasts] = useAtom(toastsAtom)
  useEffect(()=>{
    ;(window as any).__pushToast = (t: Toast)=>{
      setToasts(prev => [...prev, t])
      setTimeout(()=> setToasts(prev => prev.filter(x=>x.id!==t.id)), 3000)
    }
    return ()=>{ (window as any).__pushToast = undefined }
  },[setToasts])

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map(t=>(
        <div key={t.id}
          className={`rounded-xl px-4 py-2 shadow-soft 
          ${t.type==='error' ? 'bg-red-600 text-white' : 'bg-[rgb(var(--primary))] text-white'}`}>
          {t.text}
        </div>
      ))}
    </div>
  )
}
