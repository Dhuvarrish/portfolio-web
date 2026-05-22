"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BsSun, BsMoon } from "react-icons/bs";
import { Menu, User, Briefcase, Mail, ChevronRight, Info, FileText } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navItems = [
  { label: "About", href: "/", icon: User },
  { label: "Github", href: "/github", icon: FaGithub },
]

const projectsChildren = [
  { label: "Backend", href: "/projects/backend-api-showcase" },
  { label: "Microservice Demo", href: "/projects/microservice" },
]

const infoItem = { label: "Info", href: "/info", icon: Info }

const contactItem = { label: "Contact", href: "/contact", icon: Mail }

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background">
      <div className="flex h-full items-center px-4">
        {/* Left — pill on desktop, hidden on mobile */}
        <div className="hidden sm:flex flex-1 items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs font-medium text-muted-foreground">Open to Opportunities</span>
          </div>
        </div>

        {/* Logo — left on mobile, centered on desktop */}
        <div>
          <Link href="/" aria-label="Home">
            <Image src="/logo.png" alt="Dhuva" width={40} height={40} className="invert" priority />
          </Link>
        </div>

        {/* Right — socials always on the right */}
        <div className="flex flex-1 items-center gap-3 justify-end">
          <a
            href="https://github.com/Dhuvarrish"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-white hover:bg-muted transition-all duration-200 hover:scale-110"
          >
            <FaGithub className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/Dhuvarrish"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-[#0077B5] hover:bg-muted transition-all duration-200 hover:scale-110"
          >
            <FaLinkedin className="h-5 w-5" />
          </a>
          <Dialog>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 hover:scale-110">
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium">Resume</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[90vw] h-[90vh] flex flex-col p-0 gap-0">
              <DialogHeader className="flex flex-row items-center justify-between px-5 py-3 border-b border-border shrink-0">
                <DialogTitle className="text-sm font-medium">Resume</DialogTitle>
              </DialogHeader>
              <embed
                src="/resume.pdf"
                type="application/pdf"
                className="w-full flex-1 rounded-b-2xl"
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
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
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-4 rounded-xl px-5 py-4 text-lg font-medium transition-colors ${isActive(item.href)
                  ? "bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-active-foreground))]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <item.icon className="size-6 shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}

            <Collapsible defaultOpen={pathname.startsWith("/projects")} className="group/collapsible">
              <CollapsibleTrigger className={`flex w-full items-center gap-4 rounded-xl px-5 py-4 text-lg font-medium transition-colors
                ${pathname.startsWith("/projects")
                  ? "bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-active-foreground))]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Briefcase className="size-6 shrink-0" />
                <span>Projects</span>
                <ChevronRight className="ml-auto size-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-10 mt-1 flex flex-col gap-1 border-l border-border pl-4">
                  {projectsChildren.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center rounded-xl px-5 py-4 text-lg font-medium transition-colors
                        ${pathname === child.href
                          ? "bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-active-foreground))]"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Separator className="my-1" />
            <Link
              href={infoItem.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-4 rounded-xl px-5 py-4 text-lg font-medium transition-colors ${isActive(infoItem.href)
                ? "bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-active-foreground))]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <infoItem.icon className="size-6 shrink-0" />
              <span>{infoItem.label}</span>
            </Link>
          </nav>
          <Separator />
          <div className="p-3">
            <Link
              href={contactItem.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-4 rounded-xl px-5 py-4 text-lg font-medium transition-colors ${isActive(contactItem.href)
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
