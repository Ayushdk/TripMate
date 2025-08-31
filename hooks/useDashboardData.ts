"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface DashboardData {
  totalTrips: number;
  thisMonthTrips: number;
  totalSaved: number;
  savedCountries: number;
  upcomingTrips: number;
  completedTrips: number;
}

export function useDashboardData() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session?.user?.id]);

  return { data, loading, error };
}
