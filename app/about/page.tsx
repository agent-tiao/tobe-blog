import { getAppCloudflareEnv } from '@/lib/cloudflare'
import { getSetting } from '@/lib/db'
import { getSiteHeaderData } from '@/lib/site'
import { getSiteUrl } from '@/lib/site-config'
import { AboutContent } from './AboutContent'
import type { SiteNavLink, SiteCategoryLink } from '@/lib/site'
import type { Theme } from '@/lib/appearance'

export const revalidate = 3600

const BASE_URL = getSiteUrl()

export const metadata = {
  title: '关于',
  description: '关于博主',
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
}

const DEFAULT_SOCIAL = [
  { type: 'github' as const, url: 'https://github.com/tobebuilder' },
  { type: 'twitter' as const, url: 'https://x.com/tobe_builder' },
  { type: 'rss' as const, url: '/feed.xml' },
]

export default async function AboutPage() {
  let name = '阿条'
  let bio = '独立开发者，分享技术与生活'
  let socialLinks = DEFAULT_SOCIAL
  let navLinks: SiteNavLink[] = []
  let categories: SiteCategoryLink[] = []
  let initialTheme: Theme = 'default'

  try {
    const env = await getAppCloudflareEnv()
    if (env?.DB) {
      const [headerData, aboutName, aboutBio, aboutSocial] = await Promise.all([
        getSiteHeaderData(env.DB),
        getSetting(env.DB, 'about_name'),
        getSetting(env.DB, 'about_bio'),
        getSetting(env.DB, 'about_social'),
      ])
      navLinks = headerData.navLinks
      categories = headerData.categories
      initialTheme = headerData.defaultTheme

      if (aboutName) name = aboutName
      if (aboutBio) bio = aboutBio
      if (aboutSocial) {
        try {
          const parsed = JSON.parse(aboutSocial)
          if (Array.isArray(parsed) && parsed.length > 0) socialLinks = parsed
        } catch {}
      }
    }
  } catch {}

  return (
    <AboutContent
      name={name}
      bio={bio}
      socialLinks={socialLinks}
      navLinks={navLinks}
      categories={categories}
      initialTheme={initialTheme}
    />
  )
}
