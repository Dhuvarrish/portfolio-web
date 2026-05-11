"use client"

export function Footer() {
  return (
    <footer className="h-12 w-full border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-full items-center justify-center px-4">
        <span className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
