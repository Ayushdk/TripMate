"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useTrips } from "@/hooks/useTrips"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { useRouter } from "next/navigation"
import { PlaceholderImage } from "@/components/ui/placeholder-image"

export function UpcomingTrips() {
  const { trips, loading, refetch } = useTrips();
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    tripId: string;
    tripName: string;
  }>({
    isOpen: false,
    tripId: "",
    tripName: "",
  });
  
  // Filter to show only upcoming trips (not completed)
  const upcomingTrips = trips.filter(trip => trip.status !== 'completed');

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/trips/${deleteDialog.tripId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the trips data
        await refetch();
        // Close the dialog
        setDeleteDialog({ isOpen: false, tripId: "", tripName: "" });
        // Refresh the page to update dashboard stats
        router.refresh();
      } else {
        console.error('Failed to delete trip');
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const openDeleteDialog = (tripId: string, tripName: string) => {
    setDeleteDialog({
      isOpen: true,
      tripId,
      tripName,
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Upcoming Trips</CardTitle>
          <CardDescription className="font-sans">Loading your trips...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Upcoming Trips</CardTitle>
          <CardDescription className="font-sans">Your next adventures await</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingTrips.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming trips. Start planning your next adventure!
            </div>
          ) : (
            upcomingTrips.map((trip) => (
              <div key={trip._id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-all duration-200 group">
                <Link href={`/trips/${trip._id}`} className="flex items-center space-x-4 flex-1 min-w-0">
                  {trip.image ? (
                    <img
                      src={trip.image}
                      alt={trip.destination}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <PlaceholderImage destination={trip.destination} size="sm" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold font-serif text-foreground group-hover:text-primary transition-colors">{trip.destination}</h3>
                      <Badge variant={trip.status === "confirmed" ? "default" : "secondary"}>{trip.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground font-sans">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{trip.travelers} travelers</span>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/trips/${trip._id}`}>
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => openDeleteDialog(trip._id, trip.destination)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Trip
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, tripId: "", tripName: "" })}
        onConfirm={handleDelete}
        title="Delete Trip"
        description={`Are you sure you want to delete "${deleteDialog.tripName}"? This action cannot be undone.`}
        confirmText="Delete Trip"
        cancelText="Cancel"
      />
    </>
  )
}
