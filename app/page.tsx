import { getPosts, getPostsCount } from '@/lib/db'
import { getAppCloudflareEnv } from '@/lib/cloudflare'
import { type Theme } from '@/lib/appearance'
import type { SiteCategoryLink, SiteNavLink } from '@/lib/site'
import { getSiteHeaderData } from '@/lib/site'
import { HomeClient } from '@/components/HomeClient'
import { HomeArticleList } from '@/components/HomeArticleList'
import { getSiteUrl } from '@/lib/site-config'

const PAGE_SIZE = 25
const BASE_URL = getSiteUrl()

// Cloudflare Workers 缓存策略
export const revalidate = 0 // 不缓存 HTML，防止旧 HTML + 新部署 JS/CSS 404 导致布局跳动
export const dynamicParams = true

export const metadata = {
  alternates: {
    canonical: BASE_URL,
  },
  keywords: ['技术博客', '编程', '读书笔记', '数字花园', '阿条', 'tiaoge.blog'],
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr } = await searchParams
  const currentPage = Math.max(1, parseInt(pageStr ?? '1', 10) || 1)

  let posts: Awaited<ReturnType<typeof getPosts>> = []
  let totalCount = 0
  let navLinks: SiteNavLink[] = []
  let categories: SiteCategoryLink[] = []
  let defaultTheme: Theme = 'default'
  try {
    const env = await getAppCloudflareEnv()
    if (env?.DB) {
      const headerData = await getSiteHeaderData(env.DB)
      ;[posts, totalCount] = await Promise.all([
        getPosts(env.DB, PAGE_SIZE, (currentPage - 1) * PAGE_SIZE),
        getPostsCount(env.DB),
      ])
      navLinks = headerData.navLinks
      categories = headerData.categories
      defaultTheme = headerData.defaultTheme
    }
  } catch (e) {
    console.error('Homepage: failed to fetch posts', e)
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const categorySlugMap: Record<string, string> = Object.fromEntries(
    categories.map((cat) => [cat.name, cat.slug])
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: '阿条的博客',
            url: BASE_URL,
            description: '记录思考，分享所学，留住当下。技术、生活、读书笔记的数字花园。',
            potentialAction: {
              '@type': 'SearchAction',
              target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/search?q={search_term_string}` },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: '阿条的博客',
            url: BASE_URL,
            logo: { '@type': 'ImageObject', url: `${BASE_URL}/icon-512.png` },
          }),
        }}
      />
      <HomeClient
        initialTheme={defaultTheme}
        categories={categories}
        navLinks={navLinks}
        posts={posts}
        currentPage={currentPage}
        totalPages={totalPages}
        categorySlugMap={categorySlugMap}
      >
        <HomeArticleList
          posts={posts}
          currentPage={currentPage}
          totalPages={totalPages}
          categorySlugMap={categorySlugMap}
        />
      </HomeClient>
    </>
  )
}
