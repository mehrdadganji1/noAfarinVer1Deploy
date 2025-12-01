/**
 * Hook for fetching and monitoring AACO application status
 * Automatically refetches when application is updated
 */

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

interface AACOApplication {
  _id: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export const useAACOApplicationStatus = () => {
  const [application, setApplication] = useState<AACOApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplication = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/aaco-applications/my-application');
      
      if (response.data.application) {
        setApplication(response.data.application);
      } else {
        setApplication(null);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setApplication(null);
      } else {
        setError(err.response?.data?.error || 'خطا در دریافت وضعیت درخواست');
        console.error('Error fetching AACO application:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplication();

    // Listen for storage changes (when application is updated in another tab/page)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aaco_application_updated') {
        console.log('AACO application updated, refetching...');
        fetchApplication();
      }
    };

    // Listen for custom event (when application is updated in same tab)
    const handleCustomEvent = () => {
      console.log('AACO application updated (custom event), refetching...');
      fetchApplication();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('aaco_application_updated', handleCustomEvent);

    // Also check localStorage periodically for updates
    const checkInterval = setInterval(() => {
      const lastUpdate = localStorage.getItem('aaco_application_updated');
      if (lastUpdate) {
        const updateTime = parseInt(lastUpdate);
        const now = Date.now();
        // If updated in last 2 seconds, refetch
        if (now - updateTime < 2000) {
          fetchApplication();
          // Clear the flag after processing
          localStorage.removeItem('aaco_application_updated');
        }
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('aaco_application_updated', handleCustomEvent);
      clearInterval(checkInterval);
    };
  }, [fetchApplication]);

  const refetch = useCallback(() => {
    fetchApplication();
  }, [fetchApplication]);

  return {
    application,
    isLoading,
    error,
    refetch,
    hasApplication: !!application,
    status: application?.status || null,
  };
};
