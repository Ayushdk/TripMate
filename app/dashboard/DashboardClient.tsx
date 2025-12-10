'use client';

"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TripOverview } from "@/components/dashboard/trip-overview"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingTrips } from "@/components/dashboard/upcoming-trips"
import { AIChat } from "@/components/dashboard/ai-chat"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === "loading") {
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
      <DashboardHeader />

      <TripOverview />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <UpcomingTrips />
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <AIChat />
        </div>
      </div>
    </div>
  )
}

