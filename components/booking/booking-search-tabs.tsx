"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlightSearch } from "@/components/booking/flight-search"
import { HotelSearch } from "@/components/booking/hotel-search"
import { ActivitySearch } from "@/components/booking/activity-search"
import { Plane, Hotel, MapPin } from "lucide-react"

export function BookingSearchTabs() {
  return (
    <Tabs defaultValue="flights" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="flights" className="font-sans flex items-center space-x-2">
          <Plane className="h-4 w-4" />
          <span>Flights</span>
        </TabsTrigger>
        <TabsTrigger value="hotels" className="font-sans flex items-center space-x-2">
          <Hotel className="h-4 w-4" />
          <span>Hotels</span>
        </TabsTrigger>
        <TabsTrigger value="activities" className="font-sans flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span>Activities</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="flights">
        <FlightSearch />
      </TabsContent>

      <TabsContent value="hotels">
        <HotelSearch />
      </TabsContent>

      <TabsContent value="activities">
        <ActivitySearch />
      </TabsContent>
    </Tabs>
  )
}
