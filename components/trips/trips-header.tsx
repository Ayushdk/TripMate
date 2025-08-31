import { Button } from "@/components/ui/button"
import { Plus, Filter } from "lucide-react"
import Link from "next/link"

export function TripsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-black font-serif text-foreground">My Trips</h1>
        <p className="text-muted-foreground font-sans mt-1">Manage all your travel plans in one place</p>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button asChild>
          <Link href="/trips/create">
            <Plus className="h-4 w-4 mr-2" />
            New Trip
          </Link>
        </Button>
      </div>
    </div>
  )
}
