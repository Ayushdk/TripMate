"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Wifi, Car, Utensils, Dumbbell, ExternalLink, Heart, Plus, MapPin } from "lucide-react"

interface HotelResultsProps {
  searchData: any
  onNewSearch: () => void
}

const hotelResults = [
  {
    id: "1",
    name: "Le Marais Hotel",
    image: "/paris-hotel-marais.png",
    rating: 4.5,
    reviews: 1248,
    price: 180,
    originalPrice: 220,
    location: "Le Marais, Paris",
    distance: "0.3 km from city center",
    amenities: ["wifi", "parking", "restaurant", "gym"],
    provider: "Booking.com",
    cancellation: "Free cancellation",
    breakfast: "Breakfast included",
  },
  {
    id: "2",
    name: "Hotel des Grands Boulevards",
    image: "/paris-hotel-boulevards.png",
    rating: 4.2,
    reviews: 892,
    price: 160,
    originalPrice: 160,
    location: "2nd arr., Paris",
    distance: "0.8 km from city center",
    amenities: ["wifi", "restaurant"],
    provider: "Expedia",
    cancellation: "Non-refundable",
    breakfast: "Breakfast available",
  },
  {
    id: "3",
    name: "Hotel Malte Opera",
    image: "/paris-hotel-opera.png",
    rating: 4.0,
    reviews: 567,
    price: 140,
    originalPrice: 180,
    location: "9th arr., Paris",
    distance: "1.2 km from city center",
    amenities: ["wifi", "parking"],
    provider: "Hotels.com",
    cancellation: "Free cancellation until 24h",
    breakfast: "Continental breakfast",
  },
]

export function HotelResults({ searchData, onNewSearch }: HotelResultsProps) {
  const handleBookHotel = (hotelId: string, provider: string) => {
    console.log("[v0] Booking hotel:", hotelId, "via", provider)
  }

  const handleSaveHotel = (hotelId: string) => {
    console.log("[v0] Saving hotel to trip:", hotelId)
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return Wifi
      case "parking":
        return Car
      case "restaurant":
        return Utensils
      case "gym":
        return Dumbbell
      default:
        return Wifi
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <p className="font-semibold font-serif">{searchData.destination}</p>
                <p className="text-sm text-muted-foreground font-sans">
                  {searchData.checkIn} - {searchData.checkOut}
                </p>
              </div>
              <div>
                <p className="font-semibold font-serif">{searchData.guests} guests</p>
                <p className="text-sm text-muted-foreground font-sans">{searchData.rooms} room(s)</p>
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
          <h2 className="text-xl font-bold font-serif">Hotel Results</h2>
          <p className="text-muted-foreground font-sans">{hotelResults.length} hotels found</p>
        </div>

        <div className="space-y-4">
          {hotelResults.map((hotel) => (
            <Card key={hotel.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex space-x-6">
                  {/* Hotel Image */}
                  <img
                    src={hotel.image || "/placeholder.svg?height=200&width=300"}
                    alt={hotel.name}
                    className="w-48 h-32 rounded-lg object-cover"
                  />

                  {/* Hotel Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold font-serif">{hotel.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveHotel(hotel.id)}
                            className="bg-transparent"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(hotel.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold font-sans">{hotel.rating}</span>
                          <span className="text-sm text-muted-foreground font-sans">({hotel.reviews} reviews)</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-sm text-muted-foreground font-sans">
                        <MapPin className="h-3 w-3" />
                        <span>{hotel.location}</span>
                        <span>•</span>
                        <span>{hotel.distance}</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex items-center space-x-3">
                      {hotel.amenities.map((amenity) => {
                        const AmenityIcon = getAmenityIcon(amenity)
                        return (
                          <div key={amenity} className="flex items-center space-x-1 text-muted-foreground">
                            <AmenityIcon className="h-4 w-4" />
                            <span className="text-sm font-sans capitalize">{amenity}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Policies */}
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary" className="font-sans">
                        {hotel.cancellation}
                      </Badge>
                      <Badge variant="outline" className="font-sans">
                        {hotel.breakfast}
                      </Badge>
                    </div>
                  </div>

                  {/* Price & Booking */}
                  <div className="text-right space-y-3">
                    <div>
                      {hotel.originalPrice > hotel.price && (
                        <p className="text-sm text-muted-foreground font-sans line-through">${hotel.originalPrice}</p>
                      )}
                      <p className="text-2xl font-bold font-serif">${hotel.price}</p>
                      <p className="text-sm text-muted-foreground font-sans">per night</p>
                      <p className="text-xs text-muted-foreground font-sans">via {hotel.provider}</p>
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveHotel(hotel.id)}
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Trip
                      </Button>
                      <Button onClick={() => handleBookHotel(hotel.id, hotel.provider)} className="w-full font-sans">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
