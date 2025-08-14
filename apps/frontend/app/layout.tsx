import type { Metadata } from 'next'
import './globals.css'
import Providers from '../src/lib/providers'

export const metadata: Metadata = {
  title: 'Cafeteria Vote System',
  description: 'Kurumsal yemek oylama ve menü planlama',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
