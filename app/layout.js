import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import '@/lib/i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hirecentive Social',
  description: 'Find Your Next Job - Close to Home • Quick Start • Better Future',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 