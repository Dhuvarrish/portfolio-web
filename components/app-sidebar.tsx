"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { User, Briefcase, Mail, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { FaGithub } from "react-icons/fa"

const navItems = [
  { label: "About", href: "/", icon: User },
  { label: "Github", href: "/github", icon: FaGithub },
  { label: "Projects", href: "/projects", icon: Briefcase },
]

const contactItem = { label: "Contact", href: "/contact", icon: Mail }

function CollapseButton() {
  const { toggleSidebar, state } = useSidebar()
  const isExpanded = state === "expanded"
  return (
    <button
      onClick={toggleSidebar}
      title={isExpanded ? "Collapse" : "Expand"}
      className="flex h-11 w-full items-center gap-2 rounded-md px-2 text-lg font-medium text-muted-foreground transition-colors hover:bg-green-100 hover:text-green-800 dark:hover:bg-green-950 dark:hover:text-green-300 group-data-[collapsible=icon]:pl-2"
    >
      {isExpanded
        ? <PanelLeftClose className="size-5 shrink-0 text-green-500" />
        : <PanelLeftOpen className="size-5 shrink-0 text-green-500" />
      }
      <span className="truncate">Collapse</span>
    </button>
  )
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <CollapseButton />
      </SidebarHeader>
      <SidebarSeparator className="my-1" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild tooltip={item.label} isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator className="my-1" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={contactItem.label} isActive={pathname === contactItem.href}>
              <Link href={contactItem.href}>
                <contactItem.icon />
                <span>{contactItem.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
