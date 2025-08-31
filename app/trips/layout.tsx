import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 lg:pl-64">
          <div className="p-6 md:p-8 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  )
}
