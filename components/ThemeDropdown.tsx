'use client'

import { useState, useRef, useEffect, useSyncExternalStore } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  getClientThemePreference,
  subscribeToThemeChange,
  THEME_CHANGE_EVENT,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
  type Theme,
} from '@/lib/appearance'

export type { Theme }

export function dispatchThemeChange(theme: Theme) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }))
}

interface ThemeDropdownProps {
  // Optional style overrides for themed headers (B/C custom headers)
  buttonStyle?: React.CSSProperties
  dropdownStyle?: React.CSSProperties
  itemStyle?: React.CSSProperties
  activeItemStyle?: React.CSSProperties
  inlineMenu?: boolean
  fullWidth?: boolean
  initialTheme?: Theme
  onThemeChange?: (theme: Theme) => void
}

export function ThemeDropdown({
  buttonStyle,
  dropdownStyle,
  itemStyle,
  activeItemStyle,
  inlineMenu = false,
  fullWidth = false,
  initialTheme = 'default',
  onThemeChange,
}: ThemeDropdownProps = {}) {
  const theme = useSyncExternalStore(
    subscribeToThemeChange,
    () => getClientThemePreference(initialTheme),
    () => initialTheme,
  )
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = (t: Theme) => {
    setOpen(false)
    localStorage.setItem(THEME_STORAGE_KEY, t)
    // Update data-theme on <html>
    if (t === 'default') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', t)
    }
    // Notify other listeners (HomeClient for layout switching)
    dispatchThemeChange(t)
    onThemeChange?.(t)
  }

  return null
}
