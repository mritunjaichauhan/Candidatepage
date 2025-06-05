"use client"

import { type ReactNode, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar" // Using shadcn sidebar component [^1]
import { Button } from "@/components/ui/button"
import { User, FileText, Settings, LogOut, Bell, MapPin, CreditCard, FileCheck } from "lucide-react"

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Personal Info", href: "/", icon: User },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Identity", href: "/identity", icon: CreditCard },
    { name: "Location", href: "/location", icon: MapPin },
    { name: "Applications", href: "/applications", icon: FileCheck },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-slate-800/50 bg-black/80 backdrop-blur-xl px-4 md:px-6">
          <SidebarTrigger className="text-slate-400 hover:text-white" />
          <div className="flex-1">
            <h1 className="gradient-heading text-xl font-bold">Hirecentive</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gradient-to-r from-cyan-400/20 via-violet-500/20 to-amber-400/20 hover:from-cyan-400/30 hover:via-violet-500/30 hover:to-amber-400/30"
              >
                <User className="h-5 w-5 text-white" />
                <span className="sr-only">Account</span>
              </Button>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-[10px] font-bold text-white">
                3
              </span>
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <Sidebar className="sidebar-gradient">
            <SidebarHeader className="border-b border-slate-800/50">
              <div className="flex items-center gap-3 px-2 py-4">
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 blur-sm opacity-70"></div>
                  <div className="relative h-10 w-10 rounded-full bg-black flex items-center justify-center text-white overflow-hidden border border-slate-700/50">
                    <User className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">Candidate</span>
                  <span className="text-xs text-slate-400">ID: #12345</span>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className={`sidebar-item ${pathname === item.href ? "sidebar-item-active" : ""}`}
                      tooltip={item.name}
                    >
                      <Link href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                        <item.icon
                          className={`h-5 w-5 ${pathname === item.href ? "text-cyan-400" : "text-slate-400"}`}
                        />
                        <span className={pathname === item.href ? "text-white font-medium" : "text-slate-400"}>
                          {item.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t border-slate-800/50">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="sidebar-item">
                    <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg">
                      <LogOut className="h-5 w-5 text-slate-400" />
                      <span className="text-slate-400">Logout</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

