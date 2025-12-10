'use client';

import React from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const message = searchParams?.get("message");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 text-primary hover:text-primary/80">
            <MapPin className="h-8 w-8" />
            <span className="text-2xl font-black font-serif">TripMate</span>
          </Link>
          <p className="text-muted-foreground mt-2 font-sans">Welcome back to your travel companion</p>
        </div>

        {message && (
          <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3 text-center">
            {message}
          </div>
        )}

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold font-serif">Sign In</CardTitle>
            <CardDescription className="font-sans">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-muted-foreground font-sans">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}