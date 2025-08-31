"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plane, Calendar, Users, Search } from "lucide-react"
import { FlightResults } from "@/components/booking/flight-results"

export function FlightSearch() {
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [searchData, setSearchData] = useState({
    from: "New York (NYC)",
    to: "Paris (CDG)",
            departDate: "2025-03-15",
        returnDate: "2025-03-22",
    passengers: 2,
    class: "economy",
  })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Simulate search
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("[v0] Searching flights:", searchData)
    setIsSearching(false)
    setShowResults(true)
  }

  if (showResults) {
    return <FlightResults searchData={searchData} onNewSearch={() => setShowResults(false)} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif flex items-center space-x-2">
          <Plane className="h-5 w-5" />
          <span>Search Flights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-6">
          {/* From/To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from" className="font-sans">
                From
              </Label>
              <Input
                id="from"
                value={searchData.from}
                onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                className="font-sans"
                placeholder="Departure city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to" className="font-sans">
                To
              </Label>
              <Input
                id="to"
                value={searchData.to}
                onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                className="font-sans"
                placeholder="Destination city"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departDate" className="font-sans flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Departure</span>
              </Label>
              <Input
                id="departDate"
                type="date"
                value={searchData.departDate}
                onChange={(e) => setSearchData({ ...searchData, departDate: e.target.value })}
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="returnDate" className="font-sans">
                Return
              </Label>
              <Input
                id="returnDate"
                type="date"
                value={searchData.returnDate}
                onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                className="font-sans"
              />
            </div>
          </div>

          {/* Passengers & Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passengers" className="font-sans flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Passengers</span>
              </Label>
              <Input
                id="passengers"
                type="number"
                min="1"
                max="9"
                value={searchData.passengers}
                onChange={(e) => setSearchData({ ...searchData, passengers: Number.parseInt(e.target.value) })}
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-sans">Class</Label>
              <div className="flex space-x-2">
                {["economy", "business", "first"].map((classType) => (
                  <Button
                    key={classType}
                    type="button"
                    variant={searchData.class === classType ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchData({ ...searchData, class: classType })}
                    className="font-sans capitalize"
                  >
                    {classType}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full font-sans" disabled={isSearching}>
            {isSearching ? (
              <>
                <Search className="h-4 w-4 mr-2 animate-spin" />
                Searching flights...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Flights
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
