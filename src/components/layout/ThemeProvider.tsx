'use client'

import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Restore saved theme on mount
    try {
      const saved = localStorage.getItem('indaia-theme')
      if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      }
    } catch {}
  }, [])

  return <>{children}</>
}
