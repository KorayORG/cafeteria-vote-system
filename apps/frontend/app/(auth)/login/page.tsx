'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'

const schema = z.object({
  identityNumber: z.string().min(5, 'Geçerli bir kimlik/pasaport giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter'),
})
type Form = z.infer<typeof schema>

export default function LoginPage() {
  const { register, handleSubmit, formState:{ errors, isSubmitting } } =
    useForm<Form>({ resolver: zodResolver(schema) })
  const [err, setErr] = useState<string|undefined>()
  const router = useRouter()

  const onSubmit = async (data: Form) => {
    setErr(undefined)
    const res = await api('/auth/login', { method:'POST', body: data } as any)
    if (!res.ok) { setErr((await res.json()).message ?? 'Giriş başarısız'); return }
    router.push('/dashboard') // istersen '/' yapabilirsin
  }

  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="max-w-md mx-auto">
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Giriş Yap</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
          <input
            className="bg-white/10 rounded-lg px-3 py-2"
            placeholder="Kimlik/Pasaport No"
            {...register('identityNumber')}
          />
          {errors.identityNumber && <p className="text-red-400 text-sm">{errors.identityNumber.message}</p>}

          <input
            className="bg-white/10 rounded-lg px-3 py-2"
            placeholder="Şifre"
            type="password"
            {...register('password')}
          />
          {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}

          {err && <p className="text-red-400 text-sm">{err}</p>}

          <button disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? '...' : 'Giriş'}
          </button>

          {/* ↓↓↓ yeni eklenen kısım: register’a yönlendirme butonu ↓↓↓ */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">Hesabın yok mu?</span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.push('/register')}
            >
              Kayıt Ol
            </button>
          </div>
          {/* ↑↑↑ */}
        </form>
      </div>
    </motion.div>
  )
}
