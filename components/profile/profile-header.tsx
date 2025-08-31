"use client";

import { useSession } from "next-auth/react";

export function ProfileHeader() {
  const { data: session } = useSession();
  
  return (
    <div>
      <h1 className="text-3xl font-black font-serif text-foreground">
        {session?.user?.name ? `${session.user.name}'s Profile` : 'Profile'}
      </h1>
      <p className="text-muted-foreground font-sans mt-1">
        Manage your account information and preferences
      </p>
    </div>
  )
}
