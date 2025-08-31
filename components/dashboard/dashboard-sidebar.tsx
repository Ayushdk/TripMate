"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Home, Plane, CreditCard, User, Settings, Menu, X, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useProfileData } from "@/hooks/useProfileData"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Trips", href: "/trips", icon: Plane },
  { name: "Bookings", href: "/bookings", icon: CreditCard },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const { data: profileData } = useProfileData()

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!session?.user?.name) return "U"
    return session.user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 overflow-y-auto",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 p-6 border-b border-border">
            <MapPin className="h-8 w-8 text-primary" />
            <span className="text-2xl font-black font-serif text-foreground">TripMate</span>
          </div>

          {/* Create Trip Button */}
          <div className="p-4">
            <Button className="w-full" asChild>
              <Link href="/trips/create">
                <Plus className="h-4 w-4 mr-2" />
                Create New Trip
              </Link>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href === "/trips" && pathname.startsWith("/trips"))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-sans">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
                             <Avatar className="w-8 h-8">
                 <AvatarImage src={profileData?.user?.avatar} alt={session?.user?.name || "User Avatar"} />
                 <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                   {getUserInitials()}
                 </AvatarFallback>
               </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground font-sans">
                  {session?.user?.name || "Loading..."}
                </p>
                <p className="text-xs text-muted-foreground font-sans truncate">
                  {session?.user?.email || "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Floating Create button for mobile when sidebar is hidden */}
      {!isMobileMenuOpen && (
        <div className="lg:hidden fixed bottom-5 right-5 z-40">
          <Button size="lg" className="rounded-full shadow-lg" asChild>
            <Link href="/trips/create">
              <Plus className="h-5 w-5 mr-2" />
              New Trip
            </Link>
          </Button>
        </div>
      )}
    </>
  )
}
