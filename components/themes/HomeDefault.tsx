import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Theme } from '@/lib/appearance'
import type { SiteCategoryLink, SiteNavLink } from '@/lib/site'

interface HomeDefaultProps {
  initialTheme: Theme
  categories: SiteCategoryLink[]
  navLinks: SiteNavLink[]
  children?: ReactNode
}

export function HomeDefault({ initialTheme, categories, navLinks, children }: HomeDefaultProps) {
  return (
    <div className="min-h-full flex flex-col bg-[var(--background)]">
      <SiteHeader
        initialTheme={initialTheme}
        navLinks={navLinks}
        categories={categories}
      />
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 py-10 sm:py-14">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
