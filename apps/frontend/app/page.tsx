'use client'

import Link from 'next/link'
import { SuggestionBox } from '../src/components/SuggestionBox'
import WeekMenuPreview from '../src/components/Dashboard/WeekMenuPreview'
import ShiftVotePanel from '../src/components/Dashboard/ShiftVotePanel'
import RoleQuickActions from '../src/components/RoleQuickActions'
export default function Home() {
  return (
    <div className="grid gap-6">
      <WeekMenuPreview />
      <ShiftVotePanel />
      <SuggestionBox />
      <RoleQuickActions />
    </div>
  )
}