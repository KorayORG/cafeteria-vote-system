import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cafeteria Vote System',
  description: 'Kurumsal yemek oylama ve menü planlama',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
