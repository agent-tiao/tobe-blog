'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function TopProgressBar() {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Whenever the URL changes, we stop the navigation loading state.
    setIsNavigating(false)
  }, [pathname, searchParams])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      // Only intercept internal links that are not just anchors
      if (
        href.startsWith('/') ||
        (href.startsWith(window.location.origin) && !href.includes('#'))
      ) {
        // If it's opening in a new tab, ignore
        if (target.getAttribute('target') === '_blank') return
        // If it's a download link, ignore
        if (target.hasAttribute('download')) return
        // If it's the current page exactly, ignore
        const url = new URL(href, window.location.href)
        if (url.pathname === window.location.pathname && url.search === window.location.search) return

        setIsNavigating(true)
        
        // Safety timeout: if navigation fails or takes too long, hide the bar after 5 seconds
        setTimeout(() => setIsNavigating(false), 5000)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (!isNavigating) return null

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--editor-accent)] z-[9999]">
      <div className="h-full bg-white/30 animate-[loading-bar_1.5s_ease-in-out_infinite]" />
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `
      }} />
    </div>
  )
}
