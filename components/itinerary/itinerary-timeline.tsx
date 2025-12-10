"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Clock,
  MapPin,
  Utensils,
  Star,
  GripVertical,
  Plus,
  Edit,
  Trash2,
  Plane,
  Train,
  Bus,
  Hotel,
  DollarSign,
  Sparkles,
} from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface ItineraryTimelineProps {
  tripId: string
}

interface Activity {
  id: string
  time: string
  title: string
  type: string
  duration: string
  description: string
  icon: any
  rating?: number
  location?: string
  cost?: string
}

interface DayItinerary {
  day: number
  date: string
  activities: Activity[]
}

export function ItineraryTimeline({ tripId }: ItineraryTimelineProps) {
  const [itinerary, setItinerary] = useState<DayItinerary[]>([])
  const [loading, setLoading] = useState(true)
  const [tripData, setTripData] = useState<any>(null)

  const [summary, setSummary] = useState<{
    totalEstimatedCost?: string
    transportation?: any
  } | null>(null)

  const getActivityIcon = (type?: string) => {
    const t = type?.toLowerCase() || ""
    switch (t) {
      case "transportation":
        return Plane
      case "train":
        return Train
      case "bus":
        return Bus
      case "flight":
        return Plane
      case "meal":
        return Utensils
      case "accommodation":
        return Hotel
      case "activity":
      default:
        return MapPin
    }
  }

  // time string -> minutes since midnight
  const parseTime = (timeStr: string): number => {
    if (!timeStr) return 0
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (!match) return 0

    let hours = parseInt(match[1])
    const minutes = parseInt(match[2])
    const period = match[3].toUpperCase()

    if (period === "PM" && hours !== 12) hours += 12
    if (period === "AM" && hours === 12) hours = 0

    return hours * 60 + minutes
  }

  const formatPrettyDate = (dateLike: string | Date): string => {
    const d = new Date(dateLike)
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateFromDay = (day: number, startDate: string): string => {
    try {
      const start = new Date(startDate)
      const currentDate = new Date(start)
      currentDate.setDate(start.getDate() + day - 1)
      return formatPrettyDate(currentDate)
    } catch {
      return `Day ${day}`
    }
  }

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`/api/trips/${tripId}`)
        if (!response.ok) throw new Error("Failed to fetch trip")
        const data = await response.json()
        setTripData(data)

        // 🔹 Summary (AI cost + transport) agar itinerary object hai
        if (data.itinerary) {
          setSummary({
            totalEstimatedCost: data.itinerary.totalEstimatedCost,
            transportation: data.itinerary.transportation,
          })
        }

        let builtItinerary: DayItinerary[] = []

        // 1️⃣ CASE 1: agar backend ne already day-wise itinerary bheji hai
        if (
          data.itinerary &&
          data.itinerary.itinerary &&
          Array.isArray(data.itinerary.itinerary) &&
          data.itinerary.itinerary.length > 0
        ) {
          builtItinerary = data.itinerary.itinerary.map((day: any) => {
            const activities: Activity[] = (day.activities || []).map(
              (act: any, index: number) => ({
                id: `day-${day.day}-act-${index}`,
                time: act.time || "TBD",
                title: act.title || "Activity",
                type: act.type || "activity",
                // duration: act.duration || "1 hour",
                description: act.description || act.location || "",
                icon: getActivityIcon(act.type),
                location: act.location,
                cost: act.estimatedCost,
              })
            )

            activities.sort((a, b) => parseTime(a.time) - parseTime(b.time))

            return {
              day: day.day || 1,
              date: day.date
                ? day.date
                : formatDateFromDay(day.day || 1, data.startDate),
              activities,
            }
          })
        }

        // 2️⃣ CASE 2: agar day-wise itinerary nahi, lekin DB me activities hain
        else if (data.activities && Array.isArray(data.activities) && data.activities.length > 0) {
          // activities ko date ke hisaab se group karo
          const grouped: Record<string, any[]> = {}

          data.activities.forEach((act: any) => {
            const dateObj = new Date(act.date)
            const key = dateObj.toISOString().slice(0, 10) // YYYY-MM-DD
            if (!grouped[key]) grouped[key] = []
            grouped[key].push(act)
          })

          // dates ko sort karo (ascending)
          const sortedDateKeys = Object.keys(grouped).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
          )

          builtItinerary = sortedDateKeys.map((dateKey, index) => {
            const activitiesForDay = grouped[dateKey].map((act, i) => {
              // description se time nikaalne ki koshish:
              // pattern: "10:00 AM - Something something (₹xxx)"
              let rawTime = ""
              let desc = act.description || ""
              if (desc.includes(" - ")) {
                const [maybeTime, rest] = desc.split(" - ", 2)
                if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(maybeTime.trim())) {
                  rawTime = maybeTime.trim()
                  desc = rest || ""
                }
              }

              return {
                id: `${dateKey}-${i}`,
                time: rawTime || "TBD",
                title: act.name || "Activity",
                type: "activity",
                // duration: "1 hour",
                description: desc || act.description || "",
                icon: getActivityIcon("activity"),
                location: act.location,
                cost: "", // agar chaahe to yahan se bhi parse kar sakte ho
              } as Activity
            })

            // time ke hisaab se sort
            activitiesForDay.sort((a, b) => parseTime(a.time) - parseTime(b.time))

            return {
              day: index + 1,
              date: formatPrettyDate(dateKey),
              activities: activitiesForDay,
            }
          })
        }

        // 3️⃣ CASE 3: fallback – sirf empty days bana do (agar dates hain)
        else if (data.startDate && data.endDate) {
          const startDate = new Date(data.startDate)
          const endDate = new Date(data.endDate)
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          const generatedItinerary: DayItinerary[] = []
          for (let i = 1; i <= diffDays; i++) {
            const currentDate = new Date(startDate)
            currentDate.setDate(startDate.getDate() + i - 1)

            generatedItinerary.push({
              day: i,
              date: formatPrettyDate(currentDate),
              activities: [],
            })
          }
          builtItinerary = generatedItinerary
        }

        setItinerary(builtItinerary)
      } catch (error) {
        console.error("Error fetching trip data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (tripId) {
      fetchTripData()
    }
  }, [tripId])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(itinerary)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setItinerary(items)
  }

  const addActivity = (dayIndex: number) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      time: "9:00 AM",
      title: "New Activity",
      type: "sightseeing",
      duration: "1 hour",
      description: "Add your activity description here",
      icon: MapPin,
    }

    const updatedItinerary = [...itinerary]
    updatedItinerary[dayIndex].activities.push(newActivity)
    setItinerary(updatedItinerary)
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updatedItinerary = [...itinerary]
    updatedItinerary[dayIndex].activities.splice(activityIndex, 1)
    setItinerary(updatedItinerary)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!tripData) {
    return <div className="text-red-500">Trip not found</div>
  }

  const generateItinerary = async () => {
    if (!tripId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/trips/${tripId}/generate-itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        window.location.reload()
      } else {
        console.error("Failed to generate itinerary")
        alert("Failed to generate itinerary. Please try again.")
      }
    } catch (error) {
      console.error("Error generating itinerary:", error)
      alert("Error generating itinerary. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ❗ Sirf tab "No itinerary" dikhana hai jab
  // 1) day-wise itinerary bhi empty ho
  // 2) aur DB me activities bhi na ho
  if (
    itinerary.length === 0 &&
    (!tripData?.activities || tripData.activities.length === 0)
  ) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="space-y-2">
          <p className="text-lg font-medium">No itinerary planned yet.</p>
          <p className="text-sm text-muted-foreground">
            {tripData?.itinerary
              ? "Itinerary is being generated..."
              : "Generate an AI-powered itinerary for your trip!"}
          </p>
        </div>
        {!tripData?.itinerary && (
          <Button onClick={generateItinerary} disabled={loading} className="mt-4">
            {loading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Itinerary
              </>
            )}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-serif">Your Itinerary</h2>
      </div>

      {/* ✅ Optional: AI summary card */}
      {summary && (summary.totalEstimatedCost || summary.transportation) && (
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Trip Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {summary.totalEstimatedCost && (
              <p>
                <span className="font-medium">Total estimated cost:</span>{" "}
                {summary.totalEstimatedCost}
              </p>
            )}
            {summary.transportation && (
              <div className="space-y-1 text-xs text-muted-foreground">
                {summary.transportation.toDestination && (
                  <p>
                    To destination: {summary.transportation.toDestination.type} •{" "}
                    {summary.transportation.toDestination.departureTime} –{" "}
                    {summary.transportation.toDestination.arrivalTime} •{" "}
                    {summary.transportation.toDestination.estimatedCost}
                  </p>
                )}
                {summary.transportation.fromDestination && (
                  <p>
                    Return: {summary.transportation.fromDestination.type} •{" "}
                    {summary.transportation.fromDestination.departureTime} –{" "}
                    {summary.transportation.fromDestination.arrivalTime} •{" "}
                    {summary.transportation.fromDestination.estimatedCost}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="itinerary">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-6"
            >
              {itinerary.map((day, dayIndex) => (
                <Draggable
                  key={day.day}
                  draggableId={day.day.toString()}
                  index={dayIndex}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="font-serif text-lg">
                              Day {day.day} • {day.date}
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => addActivity(dayIndex)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {day.activities.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground">
                              <p>No activities planned for this day</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => addActivity(dayIndex)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Activity
                              </Button>
                            </div>
                          ) : (
                            day.activities.map((activity, activityIndex) => (
                              <div
                                key={activity.id}
                                className="flex items-start space-x-3 p-3 rounded-lg border bg-card"
                              >
                                <div className="flex-shrink-0">
                                  <activity.icon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 flex-wrap">
                                        <span className="text-sm font-medium text-primary flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {activity.time}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                          • {activity.duration}
                                        </span>
                                        {activity.cost && (
                                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            {activity.cost}
                                          </span>
                                        )}
                                      </div>
                                      <h4 className="font-medium mt-1">
                                        {activity.title}
                                      </h4>
                                      {activity.location && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                          <MapPin className="h-3 w-3" />
                                          {activity.location}
                                        </p>
                                      )}
                                      {activity.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {activity.description}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      {activity.rating && (
                                        <div className="flex items-center space-x-1">
                                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                          <span className="text-sm font-medium">
                                            {activity.rating}
                                          </span>
                                        </div>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-destructive"
                                        onClick={() =>
                                          removeActivity(dayIndex, activityIndex)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
