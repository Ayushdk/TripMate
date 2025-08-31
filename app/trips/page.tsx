"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { TripsHeader } from "@/components/trips/trips-header"
import { TripsList } from "@/components/trips/trips-list"
import { TripsFilters } from "@/components/trips/trips-filters"
import { useTrips } from "@/hooks/useTrips"

export default function TripsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState("all")
  const { trips, loading: tripsLoading } = useTrips()

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === "loading" || tripsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="space-y-6">
      <TripsHeader />
      <TripsFilters 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
        trips={trips}
      />
      <TripsList activeFilter={activeFilter} />
    </div>
  )
}
