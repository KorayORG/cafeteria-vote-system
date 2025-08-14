'use client'

import Link from 'next/link'
import { SuggestionBox } from '../src/components/SuggestionBox'
import WeekMenuPreview from '../src/components/Dashboard/WeekMenuPreview'
import ShiftVotePanel from '../src/components/Dashboard/ShiftVotePanel'
import RoleQuickActions from '../src/components/RoleQuickActions'
export default function Home() {
  return (
    <div className="grid gap-6 p-6">
      <section className="card">
        <h1 className="text-2xl font-semibold mb-2">Haftalık Yemek Listesi</h1>
        <p className="text-gray-600">Bu hafta yayınlanan menüyü görüntüleyin.</p>
        <Link className="btn btn-secondary mt-3" href="/menu">Menüye Git</Link>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold mb-2">Tercih Yap</h2>
        <p className="text-gray-600">Vardiyanızı seçin ve gün gün oyunuzu verin.</p>
        <Link className="btn btn-primary mt-3" href="/vote">Oylamaya Git</Link>
      </section>

        <WeekMenuPreview />
      <ShiftVotePanel />
      <SuggestionBox />
      <RoleQuickActions />
    </div>
  )
}