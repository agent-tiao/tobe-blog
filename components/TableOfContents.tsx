'use client'

import { useEffect, useRef, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number // 1=h1, 2=h2, 3=h3
}

interface TableOfContentsProps {
  contentId: string
}

export function TableOfContents({ contentId }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)
  // 展开/折叠状态：key=h2标题id，value=是否展开
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const container = document.getElementById(contentId)
    if (!container) return

    // 解析 h1/h2/h3 标题
    const headings = Array.from(container.querySelectorAll('h1, h2, h3')) as HTMLElement[]
    const tocItems: TocItem[] = headings.map((el, idx) => {
      const level = parseInt(el.tagName[1])
      // 若标题无 id，自动生成并挂载
      if (!el.id) {
        el.id = `toc-heading-${idx}`
      }
      return { id: el.id, text: el.textContent?.trim() || '', level }
    })
    setItems(tocItems)

    // 初始化 h2 全部展开
    const initialCollapsed: Record<string, boolean> = {}
    tocItems.filter((i) => i.level === 2).forEach((i) => {
      initialCollapsed[i.id] = false
    })
    setCollapsed(initialCollapsed)

    // IntersectionObserver：追踪当前可见标题
    const headingEls = headings
    observerRef.current?.disconnect()
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // 找到最靠近视口顶部的可见标题
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId((visible[0].target as HTMLElement).id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )
    headingEls.forEach((el) => observerRef.current!.observe(el))

    return () => {
      observerRef.current?.disconnect()
    }
  }, [contentId])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (items.length === 0) return null

  // 构建树状结构：h2 为父节点，h3 为子节点，h1 视为独立条目
  const renderItems = () => {
    const nodes: React.ReactNode[] = []
    let i = 0
    while (i < items.length) {
      const item = items[i]

      if (item.level === 1) {
        nodes.push(
          <TocLink key={item.id} item={item} active={activeId === item.id} onClick={handleClick} indent={0} />
        )
        i++
      } else if (item.level === 2) {
        // 收集该 h2 下的所有 h3 子节点
        const children: TocItem[] = []
        let j = i + 1
        while (j < items.length && items[j].level === 3) {
          children.push(items[j])
          j++
        }

        const isExpanded = !collapsed[item.id]
        const hasChildren = children.length > 0
        const childActive = children.some((c) => c.id === activeId)

        nodes.push(
          <div key={item.id}>
            <div className="flex items-center gap-0.5">
              {hasChildren && (
                <button
                  onClick={() => toggleCollapse(item.id)}
                  className="toc-collapse-btn"
                  aria-label={isExpanded ? '折叠' : '展开'}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  >
                    <path d="M4 2.5l4 3.5-4 3.5V2.5z" />
                  </svg>
                </button>
              )}
              {!hasChildren && <span className="w-4 shrink-0" />}
              <TocLink
                item={item}
                active={activeId === item.id || (!isExpanded && childActive)}
                onClick={handleClick}
                indent={0}
              />
            </div>
            {hasChildren && isExpanded && (
              <div className="toc-children">
                {children.map((child) => (
                  <TocLink key={child.id} item={child} active={activeId === child.id} onClick={handleClick} indent={1} />
                ))}
              </div>
            )}
          </div>
        )
        i = j
      } else {
        // 孤立 h3（前面没有 h2 父节点）
        nodes.push(
          <TocLink key={item.id} item={item} active={activeId === item.id} onClick={handleClick} indent={1} />
        )
        i++
      }
    }
    return nodes
  }

  return (
    <aside className="toc-sidebar" aria-label="文章目录">
      <div className="toc-inner">
        <p className="toc-title">目录</p>
        <nav className="toc-nav">{renderItems()}</nav>
      </div>
    </aside>
  )
}

function TocLink({
  item,
  active,
  onClick,
  indent,
}: {
  item: TocItem
  active: boolean
  onClick: (id: string) => void
  indent: number
}) {
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`toc-link ${active ? 'toc-link-active' : ''}`}
      style={{ paddingLeft: indent > 0 ? `${indent * 12 + 4}px` : '4px' }}
      title={item.text}
    >
      {item.text}
    </button>
  )
}
