"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DollarSign, MapPin, Users, Calendar, Trash2 } from "lucide-react"
import { AIChat } from "@/components/dashboard/ai-chat"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { useRouter } from "next/navigation"

interface ItinerarySidebarProps {
  tripId: string
}

interface TripData {
  _id: string
  destination: string
  startDate: string
  endDate: string
  travelers: number
  status: string
  budget: number
  dailyBudget: number
  budgetRange: string
  interests: string[]
}

export function ItinerarySidebar({ tripId }: ItinerarySidebarProps) {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTripData = async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}`)
      if (response.ok) {
        const data = await response.json()
        setTripData(data)
      }
    } catch (error) {
      console.error('Error fetching trip data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tripId) {
      fetchTripData()
    }
  }, [tripId])

  // Refresh data every 5 seconds to stay in sync with header updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (tripId) {
        fetchTripData()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [tripId])

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Close the dialog
        setDeleteDialog(false);
        // Redirect to trips page
        router.push('/trips');
        // Refresh the page to update any parent components
        router.refresh();
      } else {
        console.error('Failed to delete trip');
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded mb-4"></div>
          <div className="h-32 bg-muted rounded mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!tripData) {
    return <div className="text-red-500">Trip not found</div>
  }

  // Calculate trip duration
  const startDate = new Date(tripData.startDate)
  const endDate = new Date(tripData.endDate)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Calculate budget progress (you can extend this with real booking data later)
  const totalBudget = tripData.budget || 0
  const dailyBudget = tripData.dailyBudget || 0
  const spentBudget = Math.floor(totalBudget * 0.3) // 30% spent for demo
  const budgetProgress = totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0

  return (
    <>
      <div className="space-y-6">
        {/* Delete Trip Button */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full font-sans"
              onClick={() => setDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Trip
            </Button>
          </CardContent>
        </Card>

        {/* Trip Overview */}
                {/* Trip Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif">Trip Overview</CardTitle>
              <Badge 
                variant={tripData.status === 'draft' ? 'secondary' : 
                         tripData.status === 'confirmed' ? 'default' : 
                         tripData.status === 'completed' ? 'outline' : 'secondary'}
                className="text-xs"
              >
                {tripData.status.charAt(0).toUpperCase() + tripData.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
  <CardContent className="space-y-4">
    {/* Duration */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-sans">Duration</span>
      </div>
      <span className="font-semibold font-sans">
        {diffDays} {diffDays === 1 ? "day" : "days"}
      </span>
    </div>

    {/* Destination */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-sans">Destination</span>
      </div>
      <span
        className="font-semibold font-sans text-right max-w-[120px] truncate"
        title={tripData.destination} // 👈 full text on hover
      >
        {tripData.destination}
      </span>
    </div>

    {/* Travelers */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-sans">Travelers</span>
      </div>
      <span className="font-semibold font-sans">
        {tripData.travelers}{" "}
        {tripData.travelers === 1 ? "person" : "people"}
      </span>
    </div>

    {/* Interests */}
    {tripData.interests && tripData.interests.length > 0 && (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-sans">Interests</span>
        </div>
        <span
          className="font-semibold font-sans text-right max-w-[120px] truncate"
          title={tripData.interests.join(", ")} // 👈 full list on hover
        >
          {tripData.interests.slice(0, 2).join(", ")}
          {tripData.interests.length > 2 && "..."}
        </span>
      </div>
    )}
  </CardContent>
</Card>


                {/* Budget Tracker */}
       <Card>
  <CardHeader>
    <CardTitle className="font-serif">Budget Tracker</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {totalBudget > 0 ? (
      <>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Daily Budget</span>
            <span className="font-medium">
              {dailyBudget > 0 ? `₹${dailyBudget.toLocaleString()}` : "Not set"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Budget</span>
            <span className="font-medium">₹{totalBudget.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span className="font-medium">₹{spentBudget.toLocaleString()}</span>
          </div>
          <Progress value={budgetProgress} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-medium text-green-600">
              ₹{(totalBudget - spentBudget).toLocaleString()}
            </span>
          </div>
        </div>

        {dailyBudget > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Total budget: ₹{dailyBudget.toLocaleString()} × {diffDays} days = ₹
            {totalBudget.toLocaleString()}
          </p>
        )}
      </>
    ) : (
      <div className="text-center py-4 text-muted-foreground">
        <p>No budget information available</p>
        <p className="text-sm">Budget information will be updated for new trips</p>
      </div>
    )}
  </CardContent>
</Card>

        {/* AI Chat */}
        <AIChat />
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Trip"
        description={`Are you sure you want to delete your trip to ${tripData.destination}? This action cannot be undone.`}
      />
    </>
  )
}
