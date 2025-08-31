"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plane, Hotel, Car, Calendar, ExternalLink, Loader2, Plus, Trash2, MoreHorizontal, RefreshCw } from "lucide-react"
import { useBookings } from "@/hooks/useBookings"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import Link from "next/link"

interface BookingsListProps {
  bookings: any[]
  error: string | null
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'flight':
      return Plane
    case 'hotel':
      return Hotel
    case 'car':
      return Car
    default:
      return Plane
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'cancelled':
      return 'destructive'
    case 'completed':
      return 'outline'
    default:
      return 'secondary'
  }
}

export function BookingsList({ bookings, error }: BookingsListProps) {
  const { deleteBooking, refetch, retryConnection } = useBookings()
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    bookingId: string
    bookingTitle: string
  }>({
    isOpen: false,
    bookingId: "",
    bookingTitle: "",
  })

  const handleDelete = async () => {
    try {
      await deleteBooking(deleteDialog.bookingId)
      await refetch()
      setDeleteDialog({ isOpen: false, bookingId: "", bookingTitle: "" })
    } catch (error) {
      console.error('Error deleting booking:', error)
    }
  }

  const openDeleteDialog = (bookingId: string, bookingTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      bookingId,
      bookingTitle,
    })
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <p className="text-lg font-semibold">Error loading bookings</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
          <Button onClick={retryConnection}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        </div>
      </div>
    )
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Plane className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
        <p className="text-muted-foreground mb-6">
          Start planning your trips and add bookings to keep track of your reservations.
        </p>
        <Button asChild>
          <Link href="/trips/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Trip
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {bookings.map((booking) => {
          const IconComponent = getIconForType(booking.type)
          const statusColor = getStatusColor(booking.status)
          
          return (
            <Card key={booking._id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold font-serif text-foreground">{booking.title}</h3>
                      <p className="text-sm text-muted-foreground font-sans">{booking.details}</p>
                      {booking.location && (
                        <p className="text-xs text-muted-foreground font-sans">{booking.location}</p>
                      )}
                      <div className="flex items-center space-x-1 mt-1 text-xs text-muted-foreground font-sans">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(booking.date).toLocaleDateString()}
                          {booking.endDate && ` - ${new Date(booking.endDate).toLocaleDateString()}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={statusColor}>{booking.status}</Badge>
                      </div>
                      <p className="font-semibold text-foreground font-sans">
                        {booking.currency || '$'}{booking.price}
                      </p>
                      {booking.confirmationNumber && (
                        <p className="text-xs text-muted-foreground font-sans">
                          Conf: {booking.confirmationNumber}
                        </p>
                      )}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/bookings/${booking._id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/bookings/${booking._id}/edit`}>
                            Edit Booking
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => openDeleteDialog(booking._id, booking.title)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, bookingId: "", bookingTitle: "" })}
        onConfirm={handleDelete}
        title="Delete Booking"
        description={`Are you sure you want to delete "${deleteDialog.bookingTitle}"? This action cannot be undone.`}
        confirmText="Delete Booking"
        cancelText="Cancel"
      />
    </>
  )
}
