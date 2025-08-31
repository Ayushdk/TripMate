"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useBookings } from "@/hooks/useBookings"
import { useTrips } from "@/hooks/useTrips"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function CreateBookingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { createBooking } = useBookings()
  const { trips } = useTrips()
  
  const [formData, setFormData] = useState({
    tripId: '',
    type: 'flight',
    title: '',
    details: '',
    date: '',
    endDate: '',
    price: '',
    currency: 'USD',
    confirmationNumber: '',
    provider: '',
    location: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const bookingData = {
        ...formData,
        price: parseFloat(formData.price),
        date: new Date(formData.date).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
      }

      await createBooking(bookingData)
      router.push('/bookings')
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/bookings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black font-serif text-foreground">Create New Booking</h1>
          <p className="text-muted-foreground font-sans mt-1">Add a new travel reservation</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tripId">Trip</Label>
                <Select value={formData.tripId} onValueChange={(value) => handleInputChange('tripId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trip" />
                  </SelectTrigger>
                  <SelectContent>
                    {trips.map((trip) => (
                      <SelectItem key={trip._id} value={trip._id}>
                        {trip.destination} ({new Date(trip.startDate).toLocaleDateString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Booking Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flight">Flight</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="car">Car Rental</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Flight to Paris"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  value={formData.provider}
                  onChange={(e) => handleInputChange('provider', e.target.value)}
                  placeholder="e.g., Air France, Hilton"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmationNumber">Confirmation Number</Label>
                <Input
                  id="confirmationNumber"
                  value={formData.confirmationNumber}
                  onChange={(e) => handleInputChange('confirmationNumber', e.target.value)}
                  placeholder="e.g., ABC123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Paris, France"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => handleInputChange('details', e.target.value)}
                placeholder="Additional details about this booking..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional notes..."
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/bookings">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Booking
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

