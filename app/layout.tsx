import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Baby Bet',
  description: 'Guess the arrival date!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
