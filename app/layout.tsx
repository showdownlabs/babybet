import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Baby Bet',
  description: 'Guess the arrival date!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="mx-auto max-w-md p-4">{children}</div>
      </body>
    </html>
  )
}

