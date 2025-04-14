import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'
import ScrollProgress from '@/components/ScrollProgress'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Buddhsen Tripathi',
  description: 'Full Stack Web developer portfolio showcasing projects and skills in Next.js, React, TypeScript, and full-stack development and technical blogs',
  authors: [{ name: 'Buddhsen Tripathi' }],
  creator: 'Buddhsen Tripathi',
  metadataBase: new URL('https://buddhsentripathi.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://buddhsentripathi.com',
    title: 'Buddhsen Tripathi',
    description: 'Full stack web developer portfolio showcasing projects and skills in Next.js, React, TypeScript, and full-stack development and technical blogs',
    siteName: 'Buddhsen Tripathi Portfolio',
    images: [
      {
        url: '/default-image.webp',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buddhsen Tripathi',
    description: 'Full stack Web developer portfolio showcasing projects and skills in Next.js, React, TypeScript, and full-stack development and technical blogs',
    creator: '@btr1pathi',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground flex flex-col min-h-screen antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > <ScrollProgress />
          <Navbar />
          <main className="flex-grow">
            <div className="max-w-[1000px] mx-auto px-4 py-12">
              {children}
            </div>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}