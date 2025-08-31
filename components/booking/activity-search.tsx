"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Users, Search } from "lucide-react"
import { ActivityResults } from "@/components/booking/activity-results"

const activityCategories = [
  "Tours & Sightseeing",
  "Museums & Culture",
  "Food & Drink",
  "Adventure",
  "Entertainment",
  "Nature & Outdoors",
  "Shopping",
  "Nightlife",
]

export function ActivitySearch() {
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [searchData, setSearchData] = useState({
    destination: "Paris, France",
            date: "2025-03-16",
    participants: 2,
    categories: [] as string[],
  })

  const handleCategoryToggle = (category: string) => {
    setSearchData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Simulate search
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("[v0] Searching activities:", searchData)
    setIsSearching(false)
    setShowResults(true)
  }

  if (showResults) {
    return <ActivityResults searchData={searchData} onNewSearch={() => setShowResults(false)} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Search Activities</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="font-sans">
              Destination
            </Label>
            <Input
              id="destination"
              value={searchData.destination}
              onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
              className="font-sans"
              placeholder="City or attraction"
            />
          </div>

          {/* Date & Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="font-sans flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={searchData.date}
                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participants" className="font-sans flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Participants</span>
              </Label>
              <Input
                id="participants"
                type="number"
                min="1"
                max="20"
                value={searchData.participants}
                onChange={(e) => setSearchData({ ...searchData, participants: Number.parseInt(e.target.value) })}
                className="font-sans"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <Label className="font-sans">Categories (Optional)</Label>
            <div className="flex flex-wrap gap-2">
              {activityCategories.map((category) => (
                <Badge
                  key={category}
                  variant={searchData.categories.includes(category) ? "default" : "outline"}
                  className="cursor-pointer font-sans"
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full font-sans" disabled={isSearching}>
            {isSearching ? (
              <>
                <Search className="h-4 w-4 mr-2 animate-spin" />
                Searching activities...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Activities
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
