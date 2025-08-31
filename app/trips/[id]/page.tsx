import { ItineraryHeader } from "@/components/itinerary/itinerary-header"
import { ItineraryTimeline } from "@/components/itinerary/itinerary-timeline"
import { ItinerarySidebar } from "@/components/itinerary/itinerary-sidebar"

export default function TripDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <ItineraryHeader tripId={params.id} />

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <ItineraryTimeline tripId={params.id} />
        </div>
        <div>
          <ItinerarySidebar tripId={params.id} />
        </div>
      </div>
    </div>
  )
}
