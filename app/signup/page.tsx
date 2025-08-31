import { SignupForm } from "@/components/auth/signup-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 text-primary hover:text-primary/80">
            <MapPin className="h-8 w-8" />
            <span className="text-2xl font-black font-serif">TripMate</span>
          </Link>
          <p className="text-muted-foreground mt-2 font-sans">Start your journey with us</p>
        </div>

        {/* Signup Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold font-serif">Create Account</CardTitle>
            <CardDescription className="font-sans">Join thousands of travelers planning amazing trips</CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-muted-foreground font-sans">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
