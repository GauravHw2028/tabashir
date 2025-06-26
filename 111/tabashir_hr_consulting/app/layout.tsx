import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

import { Work_Sans } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Tabashir',
  description: 'Joabboard platform',
}

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-work-sans',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={workSans.className}>
        <Toaster />
        {children}
      </body>
    </html>
  )
}
