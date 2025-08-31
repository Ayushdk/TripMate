"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Calendar, DollarSign, MapPin } from "lucide-react"
import { useDashboardData } from "@/hooks/useDashboardData";

export function TripOverview() {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-sans text-muted-foreground">
                {i === 1 ? "Total Trips" : i === 2 ? "This Month" : i === 3 ? "Total Saved" : "Countries"}
              </CardTitle>
              {i === 1 ? <Plane className="h-4 w-4 text-muted-foreground" /> : 
               i === 2 ? <Calendar className="h-4 w-4 text-muted-foreground" /> :
               i === 3 ? <DollarSign className="h-4 w-4 text-muted-foreground" /> :
               <MapPin className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif text-foreground">-</div>
              <p className="text-xs text-muted-foreground font-sans">Data unavailable</p>
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  const stats = [
    {
      title: "Total Trips",
      value: data.totalTrips.toString(),
      icon: Plane,
      description: `${data.upcomingTrips} upcoming`,
    },
    {
      title: "This Month",
      value: data.thisMonthTrips.toString(),
      icon: Calendar,
      description: data.thisMonthTrips > 0 ? "Recent trips" : "No trips this month",
    },
    {
      title: "Total Saved",
              value: `₹${data.totalSaved.toLocaleString()}`,
      icon: DollarSign,
      description: "vs manual booking",
    },
    {
      title: "Countries",
      value: data.savedCountries.toString(),
      icon: MapPin,
      description: data.savedCountries === 1 ? "country visited" : "countries visited",
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground font-sans">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
