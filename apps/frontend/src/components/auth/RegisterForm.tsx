'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  identityNumber: z.string().regex(/^(?:\d{11}|[A-Za-z0-9]{5,20})$/, 'Kimlik/Pasaport formatı geçersiz'),
  fullName: z.string().min(3, 'Ad Soyad gerekli'),
  phone: z.string().regex(/^\d{10}$/, 'Telefon 10 haneli olmalı (5XXXXXXXXX)'),
  password: z.string().min(6, 'Şifre en az 6 karakter'),
})

type Form = z.infer<typeof schema>

export default function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: Form) => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      credentials: 'include',
      body: JSON.stringify(values),
    })
    const j = await res.json().catch(()=>({}))
    if (res.ok) {
      alert('Kayıt başarılı. Şimdi giriş yapabilirsiniz.')
      reset()
      onSuccess()
    } else {
      alert(j?.message || 'Kayıt başarısız')
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Kimlik / Pasaport" {...register('identityNumber')} />
      {errors.identityNumber && <p className="text-red-600 text-sm">{errors.identityNumber.message}</p>}

      <input placeholder="Ad Soyad" {...register('fullName')} />
      {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName.message}</p>}

      <input placeholder="Telefon (5XXXXXXXXX)" {...register('phone')} />
      {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}

      <input type="password" placeholder="Şifre" {...register('password')} />
      {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}

      <button className="btn btn-primary" disabled={isSubmitting}>Kayıt Ol</button>
    </form>
  )
}
