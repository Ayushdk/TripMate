import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Calendar, CreditCard } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Create New Trip",
    description: "Start planning your next adventure",
    icon: Plus,
    href: "/trips/create",
    variant: "default" as const,
  },
  {
    title: "Explore Destinations",
    description: "Discover new places to visit",
    icon: Search,
    href: "/explore",
    variant: "outline" as const,
  },
  {
    title: "View Calendar",
    description: "See all your travel dates",
    icon: Calendar,
    href: "/calendar",
    variant: "outline" as const,
  },
  {
    title: "Manage Bookings",
    description: "Track your reservations",
    icon: CreditCard,
    href: "/bookings",
    variant: "outline" as const,
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button 
            key={action.title} 
            variant={action.variant} 
            className={`w-full justify-start h-auto p-4 ${
              action.variant === 'outline' 
                ? 'hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 hover:border-blue-300 dark:hover:border-blue-700' 
                : ''
            }`} 
            asChild
          >
            <Link href={action.href}>
              <div className="flex items-start space-x-3">
                <action.icon className="h-5 w-5 mt-0.5" />
                <div className="text-left">
                  <div className="font-medium font-sans">{action.title}</div>
                  <div className="text-xs text-muted-foreground font-sans">{action.description}</div>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
