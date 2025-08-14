'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  identityNumber: z.string().min(5, 'Kimlik/Pasaport gerekli'),
  password: z.string().min(6, 'Şifre en az 6 karakter'),
})

type Form = z.infer<typeof schema>

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) })
  const onSubmit = async (values: Form) => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      credentials: 'include',
      body: JSON.stringify(values),
    })
    if (res.ok) onSuccess()
    else {
      const j = await res.json().catch(()=>({}))
      alert(j?.message || 'Giriş başarısız')
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Kimlik / Pasaport" {...register('identityNumber')} />
      {errors.identityNumber && <p className="text-red-600 text-sm">{errors.identityNumber.message}</p>}
      <input type="password" placeholder="Şifre" {...register('password')} />
      {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
      <button className="btn btn-primary" disabled={isSubmitting}>Giriş Yap</button>
    </form>
  )
}
