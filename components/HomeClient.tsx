'use client'

import dynamic from 'next/dynamic'
import { useEffect, useSyncExternalStore, type ReactNode } from 'react'
import { getClientThemePreference, subscribeToThemeChange, type Theme } from '@/lib/appearance'
import type { PostWithTags } from '@/lib/db'
import type { SiteCategoryLink, SiteNavLink } from '@/lib/site'
import { HomeDefault } from '@/components/themes/HomeDefault'

export type { Theme }

export interface HomeProps {
  initialTheme: Theme
  posts: PostWithTags[]
  categories: SiteCategoryLink[]
  navLinks: SiteNavLink[]
  currentPage: number
  totalPages: number
  categorySlugMap: Record<string, string>
}

export interface HomeClientProps {
  initialTheme: Theme
  categories: SiteCategoryLink[]
  navLinks: SiteNavLink[]
  children?: ReactNode
  // 非默认主题仍需要这些数据
  posts?: PostWithTags[]
  currentPage?: number
  totalPages?: number
  categorySlugMap?: Record<string, string>
}

const HomeVariantA = dynamic<HomeProps>(() =>
  import('@/components/themes/HomeVariantA').then((module) => module.HomeVariantA)
)

const HomeVariantB = dynamic<HomeProps>(() =>
  import('@/components/themes/HomeVariantB').then((module) => module.HomeVariantB)
)

const HomeVariantC = dynamic<HomeProps>(() =>
  import('@/components/themes/HomeVariantC').then((module) => module.HomeVariantC)
)

function injectFont(id: string, href: string) {
  if (typeof document === 'undefined') return
  if (!document.getElementById(id)) {
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }
}

export function HomeClient({
  initialTheme,
  categories,
  navLinks,
  children,
  posts = [],
  currentPage = 1,
  totalPages = 1,
  categorySlugMap = {},
}: HomeClientProps) {
  const theme = useSyncExternalStore(
    subscribeToThemeChange,
    () => getClientThemePreference(initialTheme),
    () => initialTheme,
  )

  useEffect(() => {
    if (theme === 'refined' || theme === 'terminal' || theme === 'editorial') {
      injectFont(
        'qm-jetbrains-mono',
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap',
      )
    }
    if (theme === 'editorial') {
      injectFont(
        'qm-noto-serif-sc',
        'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700;900&display=swap',
      )
    }
  }, [theme])

  // default / warm：文章列表由服务端渲染后作为 children 传入，React 不会重新 hydrate，React 不会重新 hydrate
  if (theme === 'default' || theme === 'warm') {
    return (
      <HomeDefault initialTheme={initialTheme} navLinks={navLinks} categories={categories}>
        {children}
      </HomeDefault>
    )
  }

  // 其他主题：保持原有逻辑，自行渲染文章列表
  const fullProps: HomeProps = { initialTheme, posts, categories, navLinks, currentPage, totalPages, categorySlugMap }

  if (theme === 'refined') return <HomeVariantA {...fullProps} />
  if (theme === 'editorial') return <HomeVariantB {...fullProps} />
  if (theme === 'terminal') return <HomeVariantC {...fullProps} />

  return (
    <HomeDefault initialTheme={initialTheme} navLinks={navLinks} categories={categories}>
      {children}
    </HomeDefault>
  )
}
