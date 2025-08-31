"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, ExternalLink, Heart, Plus, MapPin } from "lucide-react"

interface ActivityResultsProps {
  searchData: any
  onNewSearch: () => void
}

const activityResults = [
  {
    id: "1",
    name: "Skip-the-Line Louvre Museum Tour",
    image: "/paris-louvre-tour.png",
    rating: 4.8,
    reviews: 2156,
    price: 45,
    duration: "3 hours",
    category: "Museums & Culture",
    provider: "GetYourGuide",
    highlights: ["Skip-the-line access", "Expert guide", "Small group"],
    description: "Discover the world's most famous artworks with an expert guide",
    maxParticipants: 15,
    languages: ["English", "French", "Spanish"],
  },
  {
    id: "2",
    name: "Seine River Dinner Cruise",
    image: "/paris-seine-cruise.png",
    rating: 4.5,
    reviews: 1834,
    price: 89,
    duration: "2.5 hours",
    category: "Food & Drink",
    provider: "Viator",
    highlights: ["3-course dinner", "Live music", "City views"],
    description: "Romantic dinner cruise with panoramic views of Paris landmarks",
    maxParticipants: 200,
    languages: ["English", "French"],
  },
  {
    id: "3",
    name: "Montmartre Walking Tour",
    image: "/paris-montmartre-tour.png",
    rating: 4.6,
    reviews: 987,
    price: 25,
    duration: "2 hours",
    category: "Tours & Sightseeing",
    provider: "Airbnb Experiences",
    highlights: ["Local guide", "Hidden gems", "Photo stops"],
    description: "Explore the artistic heart of Paris with a local guide",
    maxParticipants: 8,
    languages: ["English"],
  },
]

export function ActivityResults({ searchData, onNewSearch }: ActivityResultsProps) {
  const handleBookActivity = (activityId: string, provider: string) => {
    console.log("[v0] Booking activity:", activityId, "via", provider)
  }

  const handleSaveActivity = (activityId: string) => {
    console.log("[v0] Saving activity to trip:", activityId)
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
                <p className="text-sm text-muted-foreground font-sans">{searchData.date}</p>
              </div>
              <div>
                <p className="font-semibold font-serif">{searchData.participants} participants</p>
                {searchData.categories.length > 0 && (
                  <p className="text-sm text-muted-foreground font-sans">
                    {searchData.categories.slice(0, 2).join(", ")}
                    {searchData.categories.length > 2 && ` +${searchData.categories.length - 2} more`}
                  </p>
                )}
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
          <h2 className="text-xl font-bold font-serif">Activity Results</h2>
          <p className="text-muted-foreground font-sans">{activityResults.length} activities found</p>
        </div>

        <div className="space-y-4">
          {activityResults.map((activity) => (
            <Card key={activity.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex space-x-6">
                  {/* Activity Image */}
                  <img
                    src={activity.image || "/placeholder.svg?height=200&width=300"}
                    alt={activity.name}
                    className="w-48 h-32 rounded-lg object-cover"
                  />

                  {/* Activity Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold font-serif">{activity.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveActivity(activity.id)}
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
                                  i < Math.floor(activity.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold font-sans">{activity.rating}</span>
                          <span className="text-sm text-muted-foreground font-sans">({activity.reviews} reviews)</span>
                        </div>
                        <Badge variant="secondary" className="font-sans">
                          {activity.category}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground font-sans mt-2">{activity.description}</p>
                    </div>

                    {/* Activity Info */}
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground font-sans">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Max {activity.maxParticipants} people</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{activity.languages.join(", ")}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2">
                      {activity.highlights.map((highlight) => (
                        <Badge key={highlight} variant="outline" className="font-sans">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Price & Booking */}
                  <div className="text-right space-y-3">
                    <div>
                      <p className="text-2xl font-bold font-serif">${activity.price}</p>
                      <p className="text-sm text-muted-foreground font-sans">per person</p>
                      <p className="text-xs text-muted-foreground font-sans">via {activity.provider}</p>
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveActivity(activity.id)}
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Trip
                      </Button>
                      <Button
                        onClick={() => handleBookActivity(activity.id, activity.provider)}
                        className="w-full font-sans"
                      >
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
