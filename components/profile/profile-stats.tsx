"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plane, Star, Award, Loader2 } from "lucide-react"
import { useProfileData } from "@/hooks/useProfileData"

export function ProfileStats() {
  const { data: profileData, loading, error } = useProfileData();

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Travel Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Travel Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8 text-red-500">
              {error ? `Error: ${error}` : 'No profile data available'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No achievements available
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: "Countries Visited",
      value: profileData.stats.countriesVisited.toString(),
      icon: MapPin,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      title: "Total Trips",
      value: profileData.stats.totalTrips.toString(),
      icon: Plane,
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      title: "Average Rating",
      value: profileData.stats.averageRating.toString(),
      icon: Star,
      color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    },
    {
      title: "Travel Level",
      value: profileData.stats.travelLevel,
      icon: Award,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Travel Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.title} className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold font-serif text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-sans">{stat.title}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {profileData.achievements.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profileData.achievements.map((achievement) => (
                <Badge key={achievement} variant="secondary" className="font-sans">
                  {achievement}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No achievements yet.</p>
              <p className="text-xs mt-1">Complete more trips to unlock achievements!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Additional Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Upcoming Trips</span>
            <span className="font-semibold">{profileData.stats.upcomingTrips}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completed Trips</span>
            <span className="font-semibold">{profileData.stats.completedTrips}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Spent</span>
            <span className="font-semibold">${profileData.stats.totalSpent.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Member Since</span>
            <span className="font-semibold">
              {new Date(profileData.user.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
