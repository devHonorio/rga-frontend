import { Poppins } from 'next/font/google'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { Metadata } from 'next'
import { ProvidersContext } from '@/contexts'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'RGA Doces e Salgados',
  description: 'Sistema de pedidos de doces, salgados e bolos',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body className={poppins.className}>
        <ProvidersContext>{children}</ProvidersContext>

        <ToastContainer autoClose={300} />
      </body>
    </html>
  )
}
