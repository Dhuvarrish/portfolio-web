"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { User, Briefcase, Mail, PanelLeftClose, PanelLeftOpen, Info } from "lucide-react"
import { FaGithub } from "react-icons/fa"

const projectsChildren = [
  { label: "Backend ", href: "/projects/backend-api-showcase" },
  { label: "Microservice", href: "/projects/microservice" },
]

const navItems = [
  { label: "About", href: "/", icon: User },
  { label: "Github", href: "/github", icon: FaGithub },
  { label: "Info", href: "/info", icon: Info }
]

const contactItem = { label: "Contact", href: "/contact", icon: Mail }

function CollapseButton() {
  const { toggleSidebar, state } = useSidebar()
  const isExpanded = state === "expanded"
  return (
    <button
      onClick={toggleSidebar}
      title={isExpanded ? "Collapse" : "Expand"}
      className="flex h-11 w-full items-center gap-2 rounded-md px-2 text-lg font-medium text-green-500 transition-colors hover:bg-green-950 hover:text-green-300 group-data-[collapsible=icon]:pl-2"
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
  const isProjectsActive = pathname.startsWith("/projects")

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

              <Collapsible defaultOpen={isProjectsActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Projects" isActive={isProjectsActive}>
                      <Briefcase />
                      <span>Projects</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {projectsChildren.map((child) => (
                        <SidebarMenuSubItem key={child.href}>
                          <SidebarMenuSubButton asChild isActive={pathname === child.href} className="h-11 text-lg">
                            <Link href={child.href}>{child.label}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
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
