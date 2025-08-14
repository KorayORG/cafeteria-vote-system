'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useState } from 'react'

const schema = z.object({
  fullName: z.string().min(3, 'Ad soyad'),
  phone: z.string().min(10, 'Telefon'),
  identityNumber: z.string().min(5, 'Kimlik/Pasaport'),
  password: z.string().min(6, 'Şifre en az 6 karakter'),
})
type Form = z.infer<typeof schema>

export default function RegisterPage() {
  const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) })
  const [err, setErr] = useState<string>()
  const router = useRouter()
  const onSubmit = async (data: Form) => {
    setErr(undefined)
    const res = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
    if (!res.ok) { setErr((await res.json()).message || 'Kayıt başarısız'); return }
    router.push('/login')
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-lg font-semibold mb-4">Kayıt Ol</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        <input className="bg-white/10 rounded-lg px-3 py-2" placeholder="Ad Soyad" {...register('fullName')} />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
        <input className="bg-white/10 rounded-lg px-3 py-2" placeholder="Telefon" {...register('phone')} />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        <input className="bg-white/10 rounded-lg px-3 py-2" placeholder="Kimlik/Pasaport No" {...register('identityNumber')} />
        {errors.identityNumber && <p className="text-red-500 text-sm">{errors.identityNumber.message}</p>}
        <input className="bg-white/10 rounded-lg px-3 py-2" placeholder="Şifre" type="password" {...register('password')} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <button disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? '...' : 'Kayıt Ol'}</button>
      </form>
    </div>
  )
}
