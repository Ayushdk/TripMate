"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Wifi, Utensils, ArrowRight, ExternalLink, Heart, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FlightResultsProps {
  searchData: any
  onNewSearch: () => void
}

const flightResults = [
  {
    id: "1",
    airline: "Air France",
    logo: "/air-france-logo.png",
    price: 650,
    duration: "8h 15m",
    stops: 0,
    departure: {
      time: "10:30 AM",
      airport: "JFK",
      date: "Mar 15",
    },
    arrival: {
      time: "11:45 PM",
      airport: "CDG",
      date: "Mar 16",
    },
    amenities: ["wifi", "meals", "entertainment"],
    provider: "Expedia",
    rating: 4.2,
    baggage: "1 checked bag included",
  },
  {
    id: "2",
    airline: "Delta",
    logo: "/delta-logo.png",
    price: 720,
    duration: "9h 45m",
    stops: 1,
    departure: {
      time: "2:15 PM",
      airport: "JFK",
      date: "Mar 15",
    },
    arrival: {
      time: "2:00 PM",
      airport: "CDG",
      date: "Mar 16",
    },
    amenities: ["wifi", "meals"],
    provider: "Kayak",
    rating: 4.0,
    baggage: "Carry-on only",
  },
  {
    id: "3",
    airline: "United",
    logo: "/united-logo.png",
    price: 580,
    duration: "10h 30m",
    stops: 1,
    departure: {
      time: "6:45 AM",
      airport: "EWR",
      date: "Mar 15",
    },
    arrival: {
      time: "10:15 PM",
      airport: "CDG",
      date: "Mar 16",
    },
    amenities: ["wifi"],
    provider: "Google Flights",
    rating: 3.8,
    baggage: "Additional fees apply",
  },
]

export function FlightResults({ searchData, onNewSearch }: FlightResultsProps) {
  const handleBookFlight = (flightId: string, provider: string) => {
    console.log("[v0] Booking flight:", flightId, "via", provider)
  }

  const handleSaveFlight = (flightId: string) => {
    console.log("[v0] Saving flight to trip:", flightId)
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return Wifi
      case "meals":
        return Utensils
      case "entertainment":
        return Clock
      default:
        return Clock
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="font-semibold font-serif">{searchData.from.split(" ")[0]}</p>
                <p className="text-sm text-muted-foreground font-sans">{searchData.departDate}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="text-center">
                <p className="font-semibold font-serif">{searchData.to.split(" ")[0]}</p>
                <p className="text-sm text-muted-foreground font-sans">{searchData.returnDate}</p>
              </div>
              <div className="text-center">
                <p className="font-semibold font-serif">{searchData.passengers} passengers</p>
                <p className="text-sm text-muted-foreground font-sans capitalize">{searchData.class}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onNewSearch} className="font-sans bg-transparent">
              New Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif">Flight Results</h2>
          <p className="text-muted-foreground font-sans">{flightResults.length} flights found</p>
        </div>

        <Tabs defaultValue="best" className="space-y-4">
          <TabsList>
            <TabsTrigger value="best" className="font-sans">
              Best
            </TabsTrigger>
            <TabsTrigger value="cheapest" className="font-sans">
              Cheapest
            </TabsTrigger>
            <TabsTrigger value="fastest" className="font-sans">
              Fastest
            </TabsTrigger>
          </TabsList>

          <TabsContent value="best" className="space-y-4">
            {flightResults.map((flight) => (
              <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      {/* Airline */}
                      <div className="flex items-center space-x-3">
                        <img
                          src={flight.logo || "/placeholder.svg?height=40&width=40"}
                          alt={flight.airline}
                          className="w-10 h-10 rounded"
                        />
                        <div>
                          <p className="font-semibold font-serif">{flight.airline}</p>
                          <p className="text-sm text-muted-foreground font-sans">{flight.baggage}</p>
                        </div>
                      </div>

                      {/* Flight Details */}
                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <p className="font-bold font-serif text-lg">{flight.departure.time}</p>
                          <p className="text-sm text-muted-foreground font-sans">{flight.departure.airport}</p>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                          <p className="text-sm text-muted-foreground font-sans">{flight.duration}</p>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div className="w-16 h-px bg-border"></div>
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          </div>
                          <p className="text-xs text-muted-foreground font-sans">
                            {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="font-bold font-serif text-lg">{flight.arrival.time}</p>
                          <p className="text-sm text-muted-foreground font-sans">{flight.arrival.airport}</p>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex items-center space-x-2">
                        {flight.amenities.map((amenity) => {
                          const AmenityIcon = getAmenityIcon(amenity)
                          return (
                            <div key={amenity} className="w-6 h-6 text-muted-foreground">
                              <AmenityIcon className="h-4 w-4" />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="text-right space-y-3">
                      <div>
                        <p className="text-2xl font-bold font-serif">${flight.price}</p>
                        <p className="text-sm text-muted-foreground font-sans">per person</p>
                        <p className="text-xs text-muted-foreground font-sans">via {flight.provider}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveFlight(flight.id)}
                          className="bg-transparent"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSaveFlight(flight.id)}
                          className="bg-transparent"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Trip
                        </Button>
                        <Button onClick={() => handleBookFlight(flight.id, flight.provider)} className="font-sans">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="cheapest">
            <p className="text-muted-foreground font-sans">Cheapest flights will be shown here...</p>
          </TabsContent>

          <TabsContent value="fastest">
            <p className="text-muted-foreground font-sans">Fastest flights will be shown here...</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
