"use client"

import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { useBookings } from "@/hooks/useBookings"

export function BookingsHeader() {
  const { bookings } = useBookings()

  // Calculate booking statistics
  const totalBookings = bookings?.length || 0
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0
  const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0
  const totalSpent = bookings?.reduce((sum, b) => sum + (b.price || 0), 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-serif text-foreground">Bookings</h1>
          <p className="text-muted-foreground font-sans mt-1">Track all your travel reservations</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/bookings/search">
              <Search className="h-4 w-4 mr-2" />
              Search & Book
            </Link>
          </Button>
          <Button asChild>
            <Link href="/bookings/create">
              <Plus className="h-4 w-4 mr-2" />
              Add Booking
            </Link>
          </Button>
        </div>
      </div>

      {/* Booking Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground font-sans">Total Bookings</p>
              <p className="text-2xl font-bold text-foreground font-serif">{totalBookings}</p>
            </div>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Search className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground font-sans">Confirmed</p>
              <p className="text-2xl font-bold text-green-600 font-serif">{confirmedBookings}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground font-sans">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 font-serif">{pendingBookings}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground font-sans">Total Spent</p>
              <p className="text-2xl font-bold text-foreground font-serif">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
