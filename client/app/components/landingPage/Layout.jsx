// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import { Caudex } from 'next/font/google'
import { Eczar } from 'next/font/google'
import './styles.css'

const caudex = Caudex({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caudex',
})
const eczar = Eczar({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-eczar',
})

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={caudex.variable + ' ' + eczar.variable}>
        {children}
      </body>
    </html>
  )
}