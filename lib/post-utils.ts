export function sanitizePostSlugInput(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/_{2,}/g, '_')
}

export function normalizePostSlug(value: string): string {
  return sanitizePostSlugInput(value)
    .replace(/^[-_]+|[-_]+$/g, '')
}

export function stripMarkdown(value: string): string {
  if (!value) return ''
  
  let clean = value
    // 1. 移除 HTML 标签
    .replace(/<[^>]*>/g, '')
    // 2. 移除代码块
    .replace(/```[\s\S]*?```/g, '')
    // 3. 移除行内代码
    .replace(/`([^`]+)`/g, '$1')
    // 4. 移除图片: ![alt](url) -> ""
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // 5. 移除链接: [text](url) -> text
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // 6. 移除标题标签: #, ##, ### 等（不论行首还是文本中）
    .replace(/#+\s+/g, '')
    // 7. 移除引用符号: > text
    .replace(/^\s*>\s+/gm, '')
    // 8. 移除无序/有序列表标识: - text, * text, + text, 1. text
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // 9. 移除粗体/斜体: **text**, *text*, __text__, _text_
    .replace(/([*_]{1,3})(.*?)\1/g, '$2')
    // 10. 移除水平分割线: ---, ===
    .replace(/^\s*[-=_]{3,}\s*$/gm, '')

  // 规范化多余空格
  return clean.replace(/\s+/g, ' ').trim()
}

export function buildAutoDescription(value: string, maxLength = 160): string {
  const cleanText = stripMarkdown(value)
  if (!cleanText) return ''
  return cleanText.slice(0, maxLength)
}
