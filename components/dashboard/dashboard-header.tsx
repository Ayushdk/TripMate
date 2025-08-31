"use client";

import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileData } from "@/hooks/useProfileData";
import { useEffect, useState } from "react";

export function DashboardHeader() {
  const { data: session } = useSession();
  const { data: profileData } = useProfileData();
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (profileData?.user?.avatar) {
      setUserAvatar(profileData.user.avatar);
    } else if (session?.user?.image) {
      setUserAvatar(session.user.image);
    }
  }, [profileData, session]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const getUserInitials = () => {
    if (!session?.user?.name) return "T";
    return session.user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left Section: Greeting */}
      <div>
        <h1 className="text-3xl font-black font-serif text-foreground">
          Welcome back, {session?.user?.name || "Traveler"}!
        </h1>
        <p className="text-muted-foreground font-sans mt-1">
          Ready to plan your next adventure?
        </p>
        {session?.user?.email && (
          <p className="text-xs text-muted-foreground mt-1">
            Signed in as <span className="font-medium">{session.user.email}</span>
          </p>
        )}
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Button asChild>
          <Link href="/trips/create">
            <Plus className="h-4 w-4 mr-2" />
            New Trip
          </Link>
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>

        {/* Profile Avatar */}
        <Avatar className="w-9 h-9">
          <AvatarImage src={userAvatar || undefined} alt="Profile" />
          <AvatarFallback className="text-sm font-bold bg-primary text-primary-foreground">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
