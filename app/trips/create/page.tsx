import { TripCreationForm } from "@/components/itinerary/trip-creation-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CreateTripPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-black font-serif text-foreground">Create New Trip</h1>
        </div>
      </div>

      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Plan Your Perfect Trip with AI</CardTitle>
            <p className="text-muted-foreground font-sans">
              Tell us about your travel preferences and let our AI create a personalized itinerary for you
            </p>
          </CardHeader>
          <CardContent>
            <TripCreationForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
