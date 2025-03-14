'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { toZonedTime, format as formatTz } from 'date-fns-tz'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [currentTime, setCurrentTime] = useState(new Date())
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return null
  }

  const timeZone = 'Asia/Kolkata'
  const zonedTime = toZonedTime(currentTime, timeZone)
  const formattedTime = formatTz(zonedTime, 'HH:mm')

  return (
    <nav className="border-none">
      <div className="max-w-[1500px] mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-lg font-semibold">
          <a href='https://www.google.com/search?q=time' target='_blank'>
            <span className="hidden sm:inline">Local time</span>
            <span className="inline sm:hidden">LT</span> : {formattedTime}
          </a>
        </div>
        <div className="flex items-center space-x-5">
          <Link href="/" className={`hover:text-primary ${pathname === '/' ? 'text-primary' : ''}`}>
            Home
          </Link>
          <Link href="/projects" className={`hover:text-primary ${pathname === '/projects' ? 'text-primary' : ''}`}>
            Projects
          </Link>
          <Link href="/blogs" className={`hover:text-primary ${pathname === '/blogs' ? 'text-primary' : ''}`}>
            Blogs
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}