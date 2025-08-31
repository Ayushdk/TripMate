"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface Booking {
  _id: string;
  userId: string;
  tripId: string;
  type: 'flight' | 'hotel' | 'car' | 'activity' | 'restaurant';
  title: string;
  details: string;
  date: string;
  endDate?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  price: number;
  currency: string;
  confirmationNumber?: string;
  provider?: string;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export function useBookings() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchBookings = async (retryAttempt = 0) => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/bookings');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch bookings');
        }
        
        const bookingsData = await response.json();
        setBookings(bookingsData);
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
          console.log(`Retrying fetch bookings (attempt ${retryAttempt + 1}/3)...`);
          setTimeout(() => {
            fetchBookings(retryAttempt + 1);
          }, 2000 * (retryAttempt + 1)); // Exponential backoff
          return;
        }
        
        setRetryCount(retryAttempt);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session?.user?.id]);

  const createBooking = async (bookingData: Omit<Booking, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }
      
      const newBooking = await response.json();
      setBookings(prev => [newBooking, ...prev]);
      return newBooking;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create booking';
      setError(errorMessage);
      throw err;
    }
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      setError(null);
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking');
      }
      
      const updatedBooking = await response.json();
      setBookings(prev => prev.map(booking => 
        booking._id === id ? updatedBooking : booking
      ));
      return updatedBooking;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update booking';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete booking');
      }
      
      setBookings(prev => prev.filter(booking => booking._id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete booking';
      setError(errorMessage);
      throw err;
    }
  };

  const refetch = async (retryAttempt = 0) => {
    if (session?.user?.id) {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/bookings');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch bookings');
        }
        
        const bookingsData = await response.json();
        setBookings(bookingsData);
        setRetryCount(0);
      } catch (err: any) {
        const errorMessage = err.message || 'An error occurred';
        setError(errorMessage);
        
        // Retry logic for connection issues
        if (retryAttempt < 3 && (
          errorMessage.includes('Database connection failed') ||
          errorMessage.includes('Network error') ||
          errorMessage.includes('Failed to fetch')
        )) {
          console.log(`Retrying refetch bookings (attempt ${retryAttempt + 1}/3)...`);
          setTimeout(() => {
            refetch(retryAttempt + 1);
          }, 2000 * (retryAttempt + 1)); // Exponential backoff
          return;
        }
        
        setRetryCount(retryAttempt);
      } finally {
        setLoading(false);
      }
    }
  };

  const retryConnection = () => {
    setError(null);
    setRetryCount(0);
    refetch();
  };

  return {
    bookings,
    loading,
    error,
    retryCount,
    createBooking,
    updateBooking,
    deleteBooking,
    refetch,
    retryConnection
  };
}
