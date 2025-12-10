'use client';

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { BookingsHeader } from "@/components/bookings/bookings-header"
import { BookingsList } from "@/components/bookings/bookings-list"
import { useBookings } from "@/hooks/useBookings"

export default function BookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { bookings, loading, error } = useBookings()

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="space-y-6">
      <BookingsHeader />
      <BookingsList bookings={bookings} error={error} />
    </div>
  )
}

