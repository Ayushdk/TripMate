"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hotel, Calendar, Users, Search } from "lucide-react"
import { HotelResults } from "@/components/booking/hotel-results"

export function HotelSearch() {
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [searchData, setSearchData] = useState({
    destination: "Paris, France",
            checkIn: "2025-03-15",
        checkOut: "2025-03-22",
    guests: 2,
    rooms: 1,
  })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Simulate search
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("[v0] Searching hotels:", searchData)
    setIsSearching(false)
    setShowResults(true)
  }

  if (showResults) {
    return <HotelResults searchData={searchData} onNewSearch={() => setShowResults(false)} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif flex items-center space-x-2">
          <Hotel className="h-5 w-5" />
          <span>Search Hotels</span>
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
              placeholder="City, hotel, or landmark"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn" className="font-sans flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Check-in</span>
              </Label>
              <Input
                id="checkIn"
                type="date"
                value={searchData.checkIn}
                onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut" className="font-sans">
                Check-out
              </Label>
              <Input
                id="checkOut"
                type="date"
                value={searchData.checkOut}
                onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                className="font-sans"
              />
            </div>
          </div>

          {/* Guests & Rooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guests" className="font-sans flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Guests</span>
              </Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max="10"
                value={searchData.guests}
                onChange={(e) => setSearchData({ ...searchData, guests: Number.parseInt(e.target.value) })}
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rooms" className="font-sans">
                Rooms
              </Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                max="5"
                value={searchData.rooms}
                onChange={(e) => setSearchData({ ...searchData, rooms: Number.parseInt(e.target.value) })}
                className="font-sans"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full font-sans" disabled={isSearching}>
            {isSearching ? (
              <>
                <Search className="h-4 w-4 mr-2 animate-spin" />
                Searching hotels...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Hotels
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
