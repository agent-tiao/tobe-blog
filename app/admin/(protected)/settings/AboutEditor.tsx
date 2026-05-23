'use client'

import { useState } from 'react'

type SocialType = 'github' | 'twitter' | 'rss' | 'wechat' | 'email' | 'link'

interface SocialLink {
  type: SocialType
  url: string
  label?: string
}

const SOCIAL_TYPE_OPTIONS: { value: SocialType; label: string }[] = [
  { value: 'github', label: 'GitHub' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'rss', label: 'RSS' },
  { value: 'wechat', label: '微信公众号' },
  { value: 'email', label: '邮箱 (mailto:)' },
  { value: 'link', label: '其他链接' },
]

interface Props {
  initialName: string
  initialBio: string
  initialSocial: string
  onSave: (key: string, value: string) => Promise<void>
  saving: boolean
}

export function AboutEditor({ initialName, initialBio, initialSocial, onSave, saving }: Props) {
  const [name, setName] = useState(initialName || '阿条')
  const [bio, setBio] = useState(initialBio || '独立开发者，分享技术与生活')
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    if (initialSocial) {
      try {
        const parsed = JSON.parse(initialSocial)
        if (Array.isArray(parsed)) return parsed
      } catch {}
    }
    return [
      { type: 'github', url: 'https://github.com/tobebuilder' },
      { type: 'twitter', url: 'https://x.com/tobe_builder' },
      { type: 'rss', url: '/feed.xml' },
    ]
  })

  const updateLink = (idx: number, field: keyof SocialLink, value: string) => {
    setSocialLinks(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l))
  }
  const removeLink = (idx: number) => setSocialLinks(prev => prev.filter((_, i) => i !== idx))
  const addLink = () => setSocialLinks(prev => [...prev, { type: 'link', url: '' }])
  const moveUp = (idx: number) => {
    if (idx <= 0) return
    setSocialLinks(prev => { const n = [...prev]; [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]]; return n })
  }
  const moveDown = (idx: number) => {
    if (idx >= socialLinks.length - 1) return
    setSocialLinks(prev => { const n = [...prev]; [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]]; return n })
  }

  const handleSave = async () => {
    await Promise.all([
      onSave('about_name', name),
      onSave('about_bio', bio),
      onSave('about_social', JSON.stringify(socialLinks)),
    ])
  }

  const inputCls = 'w-full rounded-lg border border-[var(--editor-line)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--editor-ink)] placeholder:text-[var(--editor-muted)] outline-none focus:border-[var(--editor-accent)] transition-colors'
  const btnCls = 'h-9 px-3 rounded-lg text-sm font-medium transition-colors'

  return (
    <div className="space-y-6 max-w-xl">
      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--editor-ink)]">博主名称</label>
        <input
          className={inputCls}
          placeholder="你的名字"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--editor-ink)]">一句话简介</label>
        <textarea
          className={`${inputCls} resize-none`}
          placeholder="用一句话介绍自己"
          rows={2}
          value={bio}
          onChange={e => setBio(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-[var(--editor-ink)]">社交链接</label>
        {socialLinks.map((link, idx) => (
          <div key={idx} className="flex items-center gap-2 flex-wrap">
            <select
              className="h-9 rounded-lg border border-[var(--editor-line)] bg-[var(--background)] px-2 text-sm text-[var(--editor-ink)] outline-none focus:border-[var(--editor-accent)] transition-colors"
              value={link.type}
              onChange={e => updateLink(idx, 'type', e.target.value)}
            >
              {SOCIAL_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input
              className="h-9 flex-1 min-w-[180px] rounded-lg border border-[var(--editor-line)] bg-[var(--background)] px-3 text-sm text-[var(--editor-ink)] placeholder:text-[var(--editor-muted)] outline-none focus:border-[var(--editor-accent)] transition-colors"
              placeholder="URL 或 mailto:xxx@email.com"
              value={link.url}
              onChange={e => updateLink(idx, 'url', e.target.value)}
            />
            <button onClick={() => moveUp(idx)} disabled={idx === 0} className={`${btnCls} bg-[var(--editor-soft)] text-[var(--editor-muted)] hover:text-[var(--editor-ink)] disabled:opacity-30`}>↑</button>
            <button onClick={() => moveDown(idx)} disabled={idx === socialLinks.length - 1} className={`${btnCls} bg-[var(--editor-soft)] text-[var(--editor-muted)] hover:text-[var(--editor-ink)] disabled:opacity-30`}>↓</button>
            <button onClick={() => removeLink(idx)} className={`${btnCls} text-red-500 hover:bg-rose-500/10`}>删除</button>
          </div>
        ))}
        <button
          onClick={addLink}
          className={`${btnCls} bg-[var(--editor-soft)] text-[var(--editor-ink)] hover:bg-[var(--border-warm)]`}
        >
          + 添加链接
        </button>
      </div>

      <div>
        <p className="text-xs text-[var(--editor-muted)] mb-3">
          头像自动使用网站 logo（<code className="text-xs">/icon-512.png</code>），如需更换请更新 logo 文件。
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[var(--editor-accent)] px-4 py-2 text-sm font-medium text-white hover:brightness-105 disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存关于页面'}
        </button>
      </div>
    </div>
  )
}
