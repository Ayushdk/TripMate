import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, DollarSign, Calendar, Star, Zap, Shield, Globe } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function TripMateLanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8" />
            <span className="text-2xl font-black font-serif">TripMate</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="hover:text-white hover:scale-105 transition-all duration-200 font-medium">
              Features
            </a>
            <a href="#testimonials" className="hover:text-white hover:scale-105 transition-all duration-200 font-medium">
              Reviews
            </a>
            <ThemeToggle />
            <Button variant="secondary" size="sm" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-black font-serif mb-6 leading-tight">
            Your Personalized AI Travel Companion
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed font-sans">
            Craft personalized itineraries tailored to your preferences, budget, and schedule. Spend less time
            organizing and more time exploring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
              <Link href="/dashboard">Start Planning Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black font-serif mb-4 text-foreground">Key Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
              Everything you need to plan the perfect trip, powered by advanced AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold font-serif">AI-Generated Itineraries</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed font-sans">
                  Input your destination, travel dates, and interests to receive a customized day-by-day itinerary with
                  sightseeing spots, dining recommendations, and optimal timings.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold font-serif">Personalized Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed font-sans">
                  Create personalized itineraries tailored to your preferences, interests, and travel style for a
                  truly unique travel experience.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold font-serif">Budget Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed font-sans">
                  Set your budget, and TripMate will suggest activities and accommodations that fit within your
                  financial plan, maximizing value without compromising experience.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold font-serif">Meta-Search Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed font-sans">
                  Access aggregated booking links for flights, hotels, and activities from trusted providers, ensuring
                  you get the best deals without browsing multiple websites.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold font-serif">Expense Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed font-sans">
                  Monitor your spending throughout the trip with built-in expense tracking tools, keeping you informed
                  and in control of your budget.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold font-serif">Responsive Design</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed font-sans">
                  Fully functional and visually appealing on any device, from smartphones to tablets to desktops,
                  ensuring seamless planning anywhere.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black font-serif mb-4 text-foreground">What Travelers Say</h2>
            <p className="text-xl text-muted-foreground font-sans">
              Join thousands of satisfied travelers who trust TripMate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-card-foreground mb-4 leading-relaxed font-sans">
                  "TripMate made planning our European honeymoon effortless. The AI suggestions were spot-on and saved
                  us hours of research!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    SM
                  </div>
                  <div>
                    <p className="font-semibold text-foreground font-sans">Sarah Mitchell</p>
                    <p className="text-sm text-muted-foreground font-sans">Newlywed Traveler</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-card-foreground mb-4 leading-relaxed font-sans">
                  "As a travel blogger, I've used many planning tools. TripMate's AI-powered planning and budget
                  optimization are game-changers."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    MR
                  </div>
                  <div>
                    <p className="font-semibold text-foreground font-sans">Marcus Rodriguez</p>
                    <p className="text-sm text-muted-foreground font-sans">Travel Blogger</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-card-foreground mb-4 leading-relaxed font-sans">
                  "Our family trip to Japan was perfectly organized thanks to TripMate. The kids loved the interactive
                  planning process!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    LC
                  </div>
                  <div>
                    <p className="font-semibold text-foreground font-sans">Lisa Chen</p>
                    <p className="text-sm text-muted-foreground font-sans">Family Traveler</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black font-serif mb-6">Ready to Transform Your Travel Planning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed font-sans">
            Join thousands of travelers who have discovered the future of trip planning with TripMate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
              <Link href="/dashboard">Start Your Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="text-xl font-black font-serif text-foreground">TripMate</span>
              </div>
              <p className="text-muted-foreground leading-relaxed font-sans">
                Your personalized AI travel companion for unforgettable adventures.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground font-serif">Product</h3>
              <ul className="space-y-2 text-muted-foreground font-sans">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground font-serif">Company</h3>
              <ul className="space-y-2 text-muted-foreground font-sans">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground font-serif">Support</h3>
              <ul className="space-y-2 text-muted-foreground font-sans">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground font-sans">
            <p>&copy; 2024 TripMate. All rights reserved. Experience the future of trip planning today.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
