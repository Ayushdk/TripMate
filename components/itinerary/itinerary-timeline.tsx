"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Utensils, Camera, Star, GripVertical, Plus, Edit, Trash2 } from "lucide-react"
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

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`/api/trips/${tripId}`)
        if (response.ok) {
          const data = await response.json()
          setTripData(data)
          
          // Generate itinerary based on trip data
          if (data.startDate && data.endDate) {
            const startDate = new Date(data.startDate)
            const endDate = new Date(data.endDate)
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            
            // Create empty itinerary structure
            const generatedItinerary: DayItinerary[] = []
            for (let i = 1; i <= diffDays; i++) {
              const currentDate = new Date(startDate)
              currentDate.setDate(startDate.getDate() + i - 1)
              
              generatedItinerary.push({
                day: i,
                date: currentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }),
                activities: []
              })
            }
            
            setItinerary(generatedItinerary)
          }
        }
      } catch (error) {
        console.error('Error fetching trip data:', error)
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

  if (itinerary.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No itinerary planned yet.</p>
        <p className="text-sm">Start adding activities to plan your trip!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-serif">Your Itinerary</h2>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="itinerary">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-6"
            >
              {itinerary.map((day, dayIndex) => (
                <Draggable key={day.day} draggableId={day.day.toString()} index={dayIndex}>
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
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-muted-foreground">
                                          {activity.time}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                          • {activity.duration}
                                        </span>
                                      </div>
                                      <h4 className="font-medium">{activity.title}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {activity.description}
                                      </p>
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
                                        onClick={() => removeActivity(dayIndex, activityIndex)}
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
