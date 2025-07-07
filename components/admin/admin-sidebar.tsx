"use client"

import { UserButton } from "@clerk/nextjs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboard, FileText, Users, Settings, Home, Zap } from "lucide-react"
import Link from "next/link"

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Content Management",
    url: "/admin/content",
    icon: FileText,
  },
  {
    title: "Resources",
    url: "/admin/resources",
    icon: FileText,
  },
  {
    title: "Leads",
    url: "/admin/leads",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  return (
    <Sidebar className="border-r border-gray-800">
      <SidebarHeader className="border-b border-gray-800 p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-[#3f79ff]" />
          <span className="text-xl font-bold text-white">Admin Panel</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <Link href="/" target="_blank">
                    <Home className="h-4 w-4" />
                    <span>View Site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
          <span className="text-sm text-gray-300">Admin User</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
