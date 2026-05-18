"use client"

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BsSun, BsMoon } from "react-icons/bs";
import { Menu, User, Briefcase, Mail, Cpu } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { label: "About", href: "/", icon: User },
  { label: "Github", href: "/github", icon: FaGithub },
  { label: "Projects", href: "/projects", icon: Briefcase },
]

const contactItem = { label: "Contact", href: "/contact", icon: Mail }

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b-2 border-gray-300 dark:border-border bg-background">
      <div className="flex h-full items-center justify-between px-4">
        <span className="font-semibold tracking-tight">Dhuva</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <BsSun className="h-5 w-5" />
            ) : (
              <BsMoon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="wide:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-[70%] sm:max-w-none tablet:max-w-80 p-0 flex flex-col">
          <SheetHeader className="px-6 py-5 border-b border-border">
            <SheetTitle className="text-left text-xl font-bold tracking-tight">Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-3 flex-1">
            {navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-4 rounded-xl px-5 py-4 text-lg font-medium transition-colors
                    ${isActive
                      ? "bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-active-foreground))]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <item.icon className="size-6 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
          <Separator />
          <div className="p-3">
            <Link
              href={contactItem.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-4 rounded-xl px-5 py-4 text-lg font-medium transition-colors
                ${pathname === contactItem.href
                  ? "bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-active-foreground))]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <contactItem.icon className="size-6 shrink-0" />
              <span>{contactItem.label}</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
