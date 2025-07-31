import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../lib/crypto-polyfill'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Registro de Audiencias',
  description: 'Sistema de registro y gestión de audiencias',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 