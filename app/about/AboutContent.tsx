'use client'

import Image from 'next/image'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { SiteNavLink, SiteCategoryLink } from '@/lib/site'
import type { Theme } from '@/lib/appearance'

interface SocialLink {
  type: 'github' | 'twitter' | 'rss' | 'wechat' | 'email' | 'link'
  url: string
  label?: string
}

interface AboutContentProps {
  name: string
  bio: string
  socialLinks: SocialLink[]
  navLinks: SiteNavLink[]
  categories: SiteCategoryLink[]
  initialTheme: Theme
}

const socialIcons: Record<string, (props: { className?: string }) => React.ReactElement> = {
  github: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  twitter: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  rss: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
    </svg>
  ),
  wechat: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.295.295a.326.326 0 0 0 .166-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.6-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .138.046.246.246 0 0 0 .246-.246.22.22 0 0 0-.04-.177l-.325-1.233a.491.491 0 0 1 .177-.554C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.063-6.122zm-3.74 2.632c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
    </svg>
  ),
  email: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  link: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
}

const socialLabels: Record<string, string> = {
  github: 'GitHub',
  twitter: 'Twitter / X',
  rss: 'RSS 订阅',
  wechat: '微信公众号',
  email: '发送邮件',
  link: '链接',
}

export function AboutContent({
  name,
  bio,
  socialLinks,
  navLinks,
  categories,
  initialTheme,
}: AboutContentProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: '#ffffff',
        ['--background' as string]: '#ffffff',
        ['--editor-panel' as string]: '#f8f9fa',
        ['--editor-soft' as string]: '#f1f3f5',
        ['--editor-line' as string]: '#e9ecef',
        ['--editor-ink' as string]: '#111827',
        ['--editor-muted' as string]: '#6b7280',
      }}
    >
      <SiteHeader
        initialTheme={initialTheme}
        navLinks={navLinks}
        categories={categories}
      />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24" style={{ background: '#ffffff' }}>
        <div className="flex flex-col items-center text-center max-w-sm w-full">

          {/* 头像 */}
          <div
            className="relative mb-6"
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 2px 16px rgba(0,0,0,0.10), 0 0 0 3px #fff, 0 0 0 5px #e9ecef',
              flexShrink: 0,
            }}
          >
            <Image
              src="/icon-512.png"
              alt={name}
              width={100}
              height={100}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              priority
            />
          </div>

          {/* 名称 */}
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: '#111827', fontFamily: 'Georgia, "Noto Serif SC", serif' }}
          >
            {name}
          </h1>

          {/* 简介 */}
          {bio && (
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: '#6b7280' }}
            >
              {bio}
            </p>
          )}

          {/* 社交图标行 */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((link, i) => {
                const Icon = socialIcons[link.type] ?? socialIcons.link
                const label = link.label || socialLabels[link.type] || link.type
                const isExternal = link.url.startsWith('http')
                return (
                  <a
                    key={i}
                    href={link.url}
                    title={label}
                    aria-label={label}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    style={{
                      color: '#9ca3af',
                      transition: 'color 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#c96442')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#9ca3af')}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
