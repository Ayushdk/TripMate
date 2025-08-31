"use client";

import { MapPin, Image } from "lucide-react";

interface PlaceholderImageProps {
  destination: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PlaceholderImage({ destination, className = "", size = "md" }: PlaceholderImageProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-48 h-48",
    lg: "w-full h-48"
  };

  return (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex flex-col items-center justify-center text-center p-4 border border-border/50`}>
      <div className="text-muted-foreground">
        {size === "sm" ? (
          <MapPin className="h-6 w-6 mx-auto mb-1" />
        ) : (
          <Image className="h-8 w-8 mx-auto mb-2" />
        )}
        <div className={`font-medium ${size === "sm" ? "text-xs" : "text-sm"}`}>
          {destination.split(',')[0]}
        </div>
        {size !== "sm" && (
          <div className="text-xs text-muted-foreground mt-1">
            {destination.split(',').slice(1).join(',').trim()}
          </div>
        )}
      </div>
    </div>
  );
}

