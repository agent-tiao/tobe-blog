export function SiteFooter() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-[var(--editor-line)] mt-auto">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 flex items-center justify-center gap-2 text-xs text-[var(--stone-gray)]">
        <span>© {currentYear}</span>
        <span>·</span>
        <span>阿条的博客</span>
      </div>
    </footer>
  )
}
