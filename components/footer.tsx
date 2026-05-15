"use client"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-12 z-10 border-t-2 border-gray-300 dark:border-border bg-background">
      <div className="flex h-full items-center justify-center px-4">
        <span className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
