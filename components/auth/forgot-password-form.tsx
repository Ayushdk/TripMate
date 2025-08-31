"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle } from "lucide-react"

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Password reset request for:", email)
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold font-serif">Check your email</h3>
          <p className="text-muted-foreground font-sans">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-muted-foreground font-sans">
            Didn't receive the email? Check your spam folder or try again.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setIsSubmitted(false)
            setEmail("")
          }}
          className="font-sans"
        >
          Try another email
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-sans">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className="pl-10 font-sans"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <p className="text-sm text-muted-foreground font-sans">We'll send you a link to reset your password</p>
      </div>

      <Button type="submit" className="w-full font-sans" disabled={isLoading}>
        {isLoading ? "Sending reset link..." : "Send Reset Link"}
      </Button>
    </form>
  )
}
