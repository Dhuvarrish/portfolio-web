"use client"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-12 z-10 border-t border-border bg-background">
      <div className="flex h-full w-full items-center justify-center px-4">
        <span className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} &middot; Built with Next.js, Tailwind CSS &amp; shadcn UI components
        </span>
      </div>
    </footer>
  )
}
