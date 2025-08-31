"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Trip } from "@/hooks/useTrips"

interface TripsFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  trips: Trip[]
}

export function TripsFilters({ activeFilter, onFilterChange, trips }: TripsFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Calculate dynamic counts for each filter category
  const getFilterCounts = () => {
    const now = new Date()
    
    const allTrips = trips.length
    const upcomingTrips = trips.filter(trip => 
      new Date(trip.startDate) > now && trip.status !== 'completed'
    ).length
    const pastTrips = trips.filter(trip => 
      trip.status === 'completed'
    ).length
    const draftTrips = trips.filter(trip => 
      trip.status === 'draft'
    ).length

    return [
      { id: "all", label: "All Trips", count: allTrips },
      { id: "upcoming", label: "Upcoming", count: upcomingTrips },
      { id: "past", label: "Past", count: pastTrips },
      { id: "draft", label: "Draft", count: draftTrips },
    ]
  }

  const filterOptions = getFilterCounts()

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 overflow-x-auto">
        {filterOptions.map((option) => (
          <Button
            key={option.id}
            variant={activeFilter === option.id ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(option.id)}
            className="whitespace-nowrap font-sans"
          >
            {option.label}
            <Badge variant="secondary" className="ml-2">
              {option.count}
            </Badge>
          </Button>
        ))}
      </div>

      {searchQuery && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground font-sans">Filtered by:</span>
          <Badge variant="secondary" className="font-sans">
            "{searchQuery}"
            <Button variant="ghost" size="sm" className="h-auto p-0 ml-2" onClick={() => setSearchQuery("")}>
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}
    </div>
  )
}
