import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        html, body {
          background: #ffffff !important;
        }
        :root {
          --background: #ffffff !important;
          --editor-app-bg: #ffffff !important;
          --editor-panel: #f8f9fa !important;
          --editor-soft: #f1f3f5 !important;
          --editor-line: #e9ecef !important;
          --editor-ink: #111827 !important;
          --editor-muted: #6b7280 !important;
        }
      `}</style>
      {children}
    </>
  )
}
