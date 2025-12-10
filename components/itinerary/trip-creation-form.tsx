"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Users, DollarSign, MapPin, Sparkles, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { OSMAutocomplete } from "@/components/ui/osm-autocomplete"
import { getDestinationImage } from "@/lib/unsplash"

const interestOptions = [
  "Culture & History",
  "Food & Dining",
  "Adventure",
  "Nature",
  "Shopping",
  "Nightlife",
  "Art & Museums",
  "Architecture",
  "Beach",
  "Mountains",
  "Photography",
  "Local Experiences",
]

const budgetRanges = [
  { label: "Budget (Rs.1500-2000/day)", value: "budget" },
  { label: "Mid-range (Rs.2500-4500/day)", value: "midrange" },
  { label: "Luxury (Rs.5000+/day)", value: "luxury" },
  { label: "Custom amount", value: "custom" },
]

interface Place {
  display_name: string;
  lat: string;
  lon: string;
}

// ✅ Utility to get today's date in IST as YYYY-MM-DD
const todayIST = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata"
}).format(new Date());

export function TripCreationForm() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    currentLocation: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    budgetRange: "",
    customBudget: "",
    interests: [] as string[],
    additionalNotes: "",
  })

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleCurrentLocationSelect = (place: Place) => {
    setFormData(prev => ({ ...prev, currentLocation: place.display_name }))
    setValidationError("")
  }

  const handleDestinationSelect = (place: Place) => {
    setFormData(prev => ({ ...prev, destination: place.display_name }))
    setValidationError("")
  }

  const validateForm = () => {
    if (formData.currentLocation.trim() === "" || formData.destination.trim() === "") {
      setValidationError("Please fill in both current location and destination")
      return false
    }

    // ✅ Check if locations are the same (case-insensitive)
    if (formData.currentLocation.trim().toLowerCase() === formData.destination.trim().toLowerCase()) {
      setValidationError("Current location and destination cannot be the same")
      return false
    }

    if (!formData.startDate || !formData.endDate) {
      setValidationError("Please select both start and end dates")
      return false
    }

    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)

    // ✅ Today in IST
    const today = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    )
    today.setHours(0, 0, 0, 0)

    if (startDate < today) {
      setValidationError("Start date cannot be in the past")
      return false
    }

    if (endDate <= startDate) {
      setValidationError("End date must be after start date")
      return false
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays > 365) {
      setValidationError("Trip duration cannot exceed 1 year")
      return false
    }

    if (!formData.budgetRange) {
      setValidationError("Please select a budget range")
      return false
    }

    if (formData.budgetRange === "custom" && !formData.customBudget) {
      setValidationError("Please enter your custom budget amount")
      return false
    }

    if (formData.interests.length === 0) {
      setValidationError("Please select at least one interest")
      return false
    }

    setValidationError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsGenerating(true)
    setValidationError("")
    setSuccessMessage("")

    try {
      let destinationImage = null;
      try {
        destinationImage = await getDestinationImage(formData.destination);
      } catch (imageError) {
        console.warn('Failed to fetch destination image:', imageError);
      }

      // Calculate trip duration
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      // Calculate daily budget based on selected range
      let dailyBudget = 0
      let totalBudget = 0
      
      if (formData.budgetRange === 'budget') {
        dailyBudget = 1750 // Average of Rs.1500-2000
      } else if (formData.budgetRange === 'midrange') {
        dailyBudget = 3500 // Average of Rs.2500-4500
      } else if (formData.budgetRange === 'luxury') {
        dailyBudget = 6000 // Rs.5000+
      } else if (formData.budgetRange === 'custom' && formData.customBudget) {
        dailyBudget = parseInt(formData.customBudget)
      }

      // Calculate total budget (daily × number of days)
      totalBudget = dailyBudget * diffDays

      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budget: totalBudget,
          dailyBudget: dailyBudget,
          budgetRange: formData.budgetRange,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
          image: destinationImage,
        }),
      })

      if (!response.ok) throw new Error('Failed to create trip')

      const newTrip = await response.json()
      setSuccessMessage("Trip created successfully! Generating itinerary...")

      // Generate itinerary automatically
      try {
        const itineraryResponse = await fetch(`/api/trips/${newTrip._id}/generate-itinerary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (itineraryResponse.ok) {
          setSuccessMessage("Trip created and itinerary generated! Redirecting...")
        } else {
          setSuccessMessage("Trip created! You can generate itinerary later. Redirecting...")
        }
      } catch (itineraryError) {
        console.warn('Could not generate itinerary automatically:', itineraryError)
        setSuccessMessage("Trip created! You can generate itinerary later. Redirecting...")
      }

      setTimeout(() => {
        router.push(`/trips/${newTrip._id}`)
      }, 2000)
    } catch (error) {
      console.error('Error creating trip:', error)
      setValidationError('Failed to create trip. Please try again.')
      setIsGenerating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* Validation Error */}
      {validationError && (
        <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">{validationError}</span>
        </div>
      )}

      {/* Current Location */}
      <div className="space-y-2">
        <Label htmlFor="currentLocation" className="font-sans bold italic flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span>Where are you traveling from?</span>
        </Label>
        <OSMAutocomplete
          placeholder="e.g., New York, USA"
          value={formData.currentLocation}
          onChange={(value) => setFormData(prev => ({ ...prev, currentLocation: value }))}
          onPlaceSelected={handleCurrentLocationSelect}
          className="font-sans"
        />
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <Label htmlFor="destination" className="font-sans bold italic flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span>Where do you want to go?</span>
        </Label>
        <OSMAutocomplete
          placeholder="e.g., Paris, France"
          value={formData.destination}
          onChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}
          onPlaceSelected={handleDestinationSelect}
          className="font-sans"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="font-sans bold italic flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Start Date</span>
          </Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            min={todayIST} // ✅ hide past dates (IST)
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="font-sans"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className="font-sans">
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            min={
              formData.startDate
                ? new Date(new Date(formData.startDate).getTime() + 86400000)
                    .toISOString()
                    .split("T")[0]
                : todayIST
            }
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="font-sans"
            required
          />
        </div>
      </div>

      {/* Trip Duration Display */}
      {formData.startDate && formData.endDate && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium text-foreground">
            📅 Trip Duration: {(() => {
              const start = new Date(formData.startDate);
              const end = new Date(formData.endDate);
              const diffTime = Math.abs(end.getTime() - start.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays === 1 ? '1 day' : `${diffDays} days`;
            })()}
          </div>
        </div>
      )}

      {/* Travelers */}
      <div className="space-y-2">
        <Label htmlFor="travelers" className="font-sans bold italic flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Number of Travelers</span>
        </Label>
        <Input
          id="travelers"
          type="number"
          min="1"
          max="20"
          value={formData.travelers}
          onChange={(e) => setFormData({ ...formData, travelers: Number.parseInt(e.target.value) })}
          className="font-sans"
          required
        />
      </div>

      {/* Budget */}
      <div className="space-y-4">
        <Label className="font-sans bold italic flex items-center space-x-2">
          <DollarSign className="h-4 w-4" />
          <span>Budget Range</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {budgetRanges.map((range) => (
            <Button
              key={range.value}
              type="button"
              variant={formData.budgetRange === range.value ? "default" : "outline"}
              className="justify-start font-sans"
              onClick={() => setFormData({ ...formData, budgetRange: range.value })}
            >
              {range.label}
            </Button>
          ))}
        </div>
        {formData.budgetRange === "custom" && (
          <Input
            placeholder="Enter your budget in INR"
            type="number"
            value={formData.customBudget}
            onChange={(e) => setFormData({ ...formData, customBudget: e.target.value })}
            className="font-sans"
          />
        )}
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <Label className="font-sans bold italic">What interests you most?</Label>
        <div className="grid grid-cols-2 gap-2">
          {interestOptions.map((interest) => (
            <Button
              key={interest}
              type="button"
              variant={formData.interests.includes(interest) ? "default" : "outline"}
              className="justify-start font-sans text-sm"
              onClick={() => handleInterestToggle(interest)}
            >
              {interest}
            </Button>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additionalNotes" className="font-sans">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          placeholder="Any special requirements or preferences?"
          value={formData.additionalNotes}
          onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
          className="font-sans min-h-[100px]"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isGenerating}
        className="w-full font-sans"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Trip...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Create Trip
          </>
        )}
      </Button>
    </form>
  )
}
