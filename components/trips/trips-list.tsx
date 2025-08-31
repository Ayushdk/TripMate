"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MoreHorizontal, Edit, Trash2, Share } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useTrips } from "@/hooks/useTrips"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { useRouter } from "next/navigation"
import { PlaceholderImage } from "@/components/ui/placeholder-image"

interface TripsListProps {
  activeFilter: string
}

export function TripsList({ activeFilter }: TripsListProps) {
  const { trips, loading, error, refetch } = useTrips();
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
  
  // Filter trips based on activeFilter
  const filteredTrips = trips.filter((trip) => {
    switch (activeFilter) {
      case "upcoming":
        return trip.status !== "completed"
      case "past":
        return trip.status === "completed"
      case "draft":
        return trip.status === "draft"
      default:
        return true // "all" shows everything
    }
  })

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
        // Refresh the page to update any parent components
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
    return <div className="text-center py-8 text-muted-foreground">Loading trips...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (filteredTrips.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {activeFilter === "upcoming" && "No upcoming trips found."}
        {activeFilter === "past" && "No completed trips found."}
        {activeFilter === "draft" && "No draft trips found."}
        {activeFilter === "all" && "No trips found. Start planning your first adventure!"}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrips.map((trip) => (
          <Card key={trip._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              {trip.image ? (
                <img src={trip.image} alt={trip.destination} className="w-full h-48 object-cover" />
              ) : (
                <PlaceholderImage destination={trip.destination} size="lg" />
              )}
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/trips/${trip._id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Trip
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="h-4 w-4 mr-2" />
                      Share Trip
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
              <div className="absolute top-4 left-4">
                <Badge variant={trip.status === "confirmed" ? "default" : "secondary"}>{trip.status}</Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold font-serif text-lg text-foreground">{trip.destination}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground font-sans">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{trip.travelers}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm font-sans">
                  <span className="text-muted-foreground">{trip.activities?.length || 0} activities</span>
                  <span className="font-semibold text-foreground">${trip.budget}</span>
                </div>

                <Button className="w-full font-sans" asChild>
                  <Link href={`/trips/${trip._id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
