"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, CreditCard, Users, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface Activity {
  id: string
  type: string
  title: string
  description: string
  time: string
  icon: any
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        // For now, we'll show a message that activities will be populated
        // You can extend this later to fetch real activity data from your database
        setActivities([
          {
            id: "1",
            type: "info",
            title: "Welcome to Tripmate!",
            description: "Your recent activities will appear here as you plan trips",
            time: "Just now",
            icon: MapPin,
          }
        ])
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivities()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activities</p>
            <p className="text-sm">Start planning trips to see your activity here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <activity.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium font-sans text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground font-sans">{activity.description}</p>
              <p className="text-xs text-muted-foreground font-sans mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
