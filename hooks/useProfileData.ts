"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface ProfileData {
  user: {
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
  };
  stats: {
    totalTrips: number;
    countriesVisited: number;
    upcomingTrips: number;
    completedTrips: number;
    totalSpent: number;
    averageRating: number;
    travelLevel: string;
  };
  achievements: string[];
  preferences: {
    bio?: string;
    location?: string;
    phone?: string;
    interests: string[];
  };
}

export function useProfileData() {
  const { data: session } = useSession();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const profileData = await response.json();
        setData(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [session?.user?.id]);

  const updateProfile = async (updates: Partial<ProfileData['preferences']>) => {
    try {
      console.log('useProfileData: Sending update request with:', updates); // Debug log
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('useProfileData: Response not ok:', response.status, errorText); // Debug log
        throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
      }

      const updatedData = await response.json();
      console.log('useProfileData: Received updated data:', updatedData); // Debug log
      
      setData(prev => prev ? { ...prev, preferences: { ...prev.preferences, ...updatedData } } : null);
      return updatedData;
    } catch (err) {
      console.error('useProfileData: Error in updateProfile:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return { data, loading, error, updateProfile };
}
