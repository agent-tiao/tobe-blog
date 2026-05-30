'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export function ClientHeightLogger({ children, id }: { children: React.ReactNode; id: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Use layout effect to get height immediately after hydration/DOM updates
  useLayoutEffect(() => {
    if (ref.current) {
      console.log(`[HeightLogger - ${id}] LayoutEffect height:`, ref.current.getBoundingClientRect().height)
    }
  })

  useEffect(() => {
    setMounted(true)
    if (ref.current) {
      console.log(`[HeightLogger - ${id}] UseEffect height:`, ref.current.getBoundingClientRect().height)
    }

    // Also observe size changes
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        console.log(`[HeightLogger - ${id}] ResizeObserver height changed to:`, entry.contentRect.height)
      }
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [id])

  return (
    <div ref={ref} style={{ outline: mounted ? 'none' : '1px solid red' }} data-logger-id={id}>
      {children}
    </div>
  )
}
