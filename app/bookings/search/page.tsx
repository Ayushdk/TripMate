import { BookingSearchTabs } from "@/components/booking/booking-search-tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BookingSearchPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/bookings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Link>
        </Button>
        <h1 className="text-2xl font-black font-serif text-foreground">Search & Book</h1>
      </div>

      <BookingSearchTabs />
    </div>
  )
}
