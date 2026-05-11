"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Home, User, Briefcase, Mail, PanelLeft } from "lucide-react"

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: User },
  { label: "Projects", href: "/projects", icon: Briefcase },
  { label: "Contact", href: "/contact", icon: Mail },
]

function CollapseButton() {
  const { toggleSidebar, state } = useSidebar()
  return (
    <SidebarMenuButton
      onClick={toggleSidebar}
      tooltip={state === "expanded" ? "Collapse" : "Expand"}
    >
      <PanelLeft />
      <span>Collapse</span>
    </SidebarMenuButton>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <CollapseButton />
              </SidebarMenuItem>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
