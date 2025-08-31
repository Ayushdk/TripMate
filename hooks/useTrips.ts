import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface Trip {
  _id: string;
  destination: string;
  currentLocation: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  status: 'draft' | 'planning' | 'confirmed' | 'completed';
  interests: string[];
  additionalNotes?: string;
  image?: string;
  activities: Array<{
    name: string;
    date: string;
    location: string;
    description: string;
  }>;
  createdAt: string;
  userId: string;
}

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { data: session } = useSession();

  const fetchTrips = async (retryAttempt = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/trips');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch trips');
      }
      
      const data = await response.json();
      setTrips(data);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      
      // Retry logic for connection issues
      if (retryAttempt < 3 && (
        errorMessage.includes('Database connection failed') ||
        errorMessage.includes('Network error') ||
        errorMessage.includes('Failed to fetch')
      )) {
        console.log(`Retrying fetch trips (attempt ${retryAttempt + 1}/3)...`);
        setTimeout(() => {
          fetchTrips(retryAttempt + 1);
        }, 2000 * (retryAttempt + 1)); // Exponential backoff
        return;
      }
      
      setRetryCount(retryAttempt);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData: Omit<Trip, '_id' | 'userId' | 'createdAt'>) => {
    try {
      setError(null);
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create trip');
      }
      
      const newTrip = await response.json();
      setTrips(prev => [newTrip, ...prev]);
      return newTrip;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create trip';
      setError(errorMessage);
      throw err;
    }
  };

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    try {
      setError(null);
      const response = await fetch(`/api/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update trip');
      }
      
      const updatedTrip = await response.json();
      setTrips(prev => prev.map(trip => 
        trip._id === id ? updatedTrip : trip
      ));
      return updatedTrip;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update trip';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/trips/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete trip');
      }
      
      setTrips(prev => prev.filter(trip => trip._id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete trip';
      setError(errorMessage);
      throw err;
    }
  };

  const retryConnection = () => {
    setError(null);
    setRetryCount(0);
    fetchTrips();
  };

  useEffect(() => {
    if (session) {
      fetchTrips();
    }
  }, [session]);

  return {
    trips,
    loading,
    error,
    retryCount,
    createTrip,
    updateTrip,
    deleteTrip,
    refetch: fetchTrips,
    retryConnection
  };
}
