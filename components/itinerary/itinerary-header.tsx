"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share, Download, Edit, Users, Calendar, MapPin, X, Copy, Check } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface ItineraryHeaderProps {
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
}

export function ItineraryHeader({ tripId }: ItineraryHeaderProps) {
  const [tripData, setTripData] = useState<TripData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    startDate: "",
    endDate: ""
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`/api/trips/${tripId}`)
        if (response.ok) {
          const data = await response.json()
          setTripData(data)
          setEditFormData({
            startDate: data.startDate.split('T')[0],
            endDate: data.endDate.split('T')[0]
          })
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

  const handleShare = () => {
    console.log("[v0] Sharing trip:", tripId)
  }

  const handleExport = () => {
    console.log("[v0] Exporting trip:", tripId)
  }

  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Trip link has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
      toast({
        title: "Failed to copy link",
        description: "Please try copying the URL manually.",
        variant: "destructive",
      })
    }
  }

  const handleExportPDF = async () => {
    if (!tripData) return

    try {
      // Create PDF content
      const pdfContent = generatePDFContent(tripData)
      
      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${tripData.destination.replace(/[^a-zA-Z0-9]/g, '_')}_trip_itinerary.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export successful!",
        description: "Trip itinerary has been downloaded.",
      })
    } catch (error) {
      console.error('Failed to export PDF:', error)
      toast({
        title: "Export failed",
        description: "Failed to export trip itinerary. Please try again.",
        variant: "destructive",
      })
    }
  }

  const generatePDFContent = (trip: TripData) => {
    const startDate = new Date(trip.startDate)
    const endDate = new Date(trip.endDate)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    let content = `TRIP ITINERARY\n`
    content += `================\n\n`
    content += `Destination: ${trip.destination}\n`
    content += `Duration: ${diffDays} days\n`
    content += `Start Date: ${startDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}\n`
    content += `End Date: ${endDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}\n`
    content += `Travelers: ${trip.travelers}\n`
    content += `Budget: ₹${trip.budget?.toLocaleString() || 'Not set'}\n\n`

    // Generate day-by-day structure
    for (let i = 1; i <= diffDays; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i - 1)
      
      content += `DAY ${i} - ${currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      })}\n`
      content += `${'='.repeat(50)}\n`
      content += `No activities planned yet.\n\n`
    }

    content += `\nGenerated on: ${new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })} at ${new Date().toLocaleTimeString('en-US')}\n`

    return content
  }

  const handleEditTrip = () => {
    if (tripData?.status === 'draft') {
      setEditDialogOpen(true)
      setUpdateMessage("") // Clear any previous messages
    }
  }

  const handleUpdateTrip = async () => {
    if (!tripData) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: new Date(editFormData.startDate),
          endDate: new Date(editFormData.endDate)
        }),
      })

      if (response.ok) {
        const updatedTrip = await response.json()
        setTripData(updatedTrip)
        setEditFormData({
          startDate: updatedTrip.startDate.split('T')[0],
          endDate: updatedTrip.endDate.split('T')[0]
        })
        setUpdateMessage("Trip dates updated successfully!")
        
        // Close dialog after a short delay and reload page to refresh itinerary
        setTimeout(() => {
          setEditDialogOpen(false)
          setUpdateMessage("")
          // Reload the page to refresh the itinerary timeline with new days
          window.location.reload()
        }, 800)
      } else {
        console.error('Failed to update trip')
        setUpdateMessage("Failed to update trip dates.")
      }
    } catch (error) {
      console.error('Error updating trip:', error)
      setUpdateMessage("Failed to update trip dates.")
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/trips">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trips
          </Link>
        </Button>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!tripData) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/trips">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trips
          </Link>
        </Button>
        <div className="text-red-500">Trip not found</div>
      </div>
    )
  }

  // Calculate trip duration
  const startDate = new Date(tripData.startDate)
  const endDate = new Date(tripData.endDate)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Format dates
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const dates = `${formatDate(tripData.startDate)} - ${formatDate(tripData.endDate)}`

  // Get today's date in IST as YYYY-MM-DD for min date validation
  const todayIST = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata"
  }).format(new Date())

  return (
    <>
      <div className="space-y-4">
        {/* Back button */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/trips">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trips
          </Link>
        </Button>

        {/* Trip header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-black font-serif text-foreground">{tripData.destination}</h1>
              <Badge variant="default">{tripData.status}</Badge>
            </div>

            <div className="flex items-center space-x-6 text-muted-foreground font-sans">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{dates}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{tripData.travelers} {tripData.travelers === 1 ? 'traveler' : 'travelers'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{diffDays} {diffDays === 1 ? 'day' : 'days'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyLink}
              className="flex items-center space-x-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>

                          <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Itinerary
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExport}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Export to Calendar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            <Button 
              size="sm" 
              onClick={handleEditTrip}
              disabled={tripData.status !== 'draft'}
              variant={tripData.status === 'draft' ? 'default' : 'outline'}
              className={tripData.status === 'draft' ? '' : 'opacity-50 cursor-not-allowed'}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Trip
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Trip Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Trip Dates</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              You can only edit trip dates when the status is "Draft". 
              Changes will automatically update the trip duration and budget.
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editStartDate">Start Date</Label>
                <Input
                  id="editStartDate"
                  type="date"
                  value={editFormData.startDate}
                  min={todayIST}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEndDate">End Date</Label>
                <Input
                  id="editEndDate"
                  type="date"
                  value={editFormData.endDate}
                  min={editFormData.startDate || todayIST}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Trip Duration Display */}
            {editFormData.startDate && editFormData.endDate && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium text-foreground">
                  📅 New Trip Duration: {(() => {
                    const start = new Date(editFormData.startDate);
                    const end = new Date(editFormData.endDate);
                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays === 1 ? '1 day' : `${diffDays} days`;
                  })()}
                </div>
              </div>
            )}

            {updateMessage && (
              <div className={`p-2 rounded-md text-sm ${updateMessage.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {updateMessage}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false)
                  setUpdateMessage("") // Clear message when closing
                }}
                disabled={isUpdating}
              >
                Cancel
              </Button>
                          <Button
              type="button"
              onClick={handleUpdateTrip}
              disabled={isUpdating || !editFormData.startDate || !editFormData.endDate}
            >
              {isUpdating ? 'Updating...' : 'Update Trip'}
            </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
