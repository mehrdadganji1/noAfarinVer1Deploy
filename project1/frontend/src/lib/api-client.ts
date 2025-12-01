/**
 * 🔌 Enhanced API Client
 * 
 * Type-safe API client با features:
 * - Automatic retry
 * - Request deduplication
 * - Better error handling
 * - Type safety
 */

import { api } from './api';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * API Response wrapper
 */
export interface APIResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/**
 * API Error
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Request cache for deduplication
 */
const requestCache = new Map<string, Promise<any>>();

/**
 * Generate cache key from request config
 */
function getCacheKey(config: AxiosRequestConfig): string {
  return `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
}

/**
 * Enhanced API Client
 */
export class APIClient {
  /**
   * GET request
   */
  static async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<APIResponse<T>> = await api.get(url, config);
      return response.data.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.data?.error || error.message,
        error.response?.status,
        error.code,
        error.response?.data
      );
    }
  }

  /**
   * GET request with deduplication
   */
  static async getWithCache<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const cacheKey = getCacheKey({ method: 'GET', url, ...config });
    
    if (requestCache.has(cacheKey)) {
      return requestCache.get(cacheKey)!;
    }

    const promise = this.get<T>(url, config).finally(() => {
      requestCache.delete(cacheKey);
    });

    requestCache.set(cacheKey, promise);
    return promise;
  }

  /**
   * POST request
   */
  static async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<APIResponse<T>> = await api.post(url, data, config);
      return response.data.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.data?.error || error.message,
        error.response?.status,
        error.code,
        error.response?.data
      );
    }
  }

  /**
   * PUT request
   */
  static async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<APIResponse<T>> = await api.put(url, data, config);
      return response.data.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.data?.error || error.message,
        error.response?.status,
        error.code,
        error.response?.data
      );
    }
  }

  /**
   * PATCH request
   */
  static async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<APIResponse<T>> = await api.patch(url, data, config);
      return response.data.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.data?.error || error.message,
        error.response?.status,
        error.code,
        error.response?.data
      );
    }
  }

  /**
   * DELETE request
   */
  static async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<APIResponse<T>> = await api.delete(url, config);
      return response.data.data;
    } catch (error: any) {
      throw new APIError(
        error.response?.data?.error || error.message,
        error.response?.status,
        error.code,
        error.response?.data
      );
    }
  }

  /**
   * Request with retry
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on client errors (4xx)
        if (error.status && error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Wait before retry
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }

    throw lastError!;
  }
}

/**
 * Query key factory for React Query
 */
export const queryKeys = {
  // User
  user: {
    me: () => ['user', 'me'] as const,
    profile: (userId?: string) => ['user', 'profile', userId] as const,
  },

  // XP
  xp: {
    my: () => ['xp', 'my'] as const,
    history: (params?: any) => ['xp', 'history', params] as const,
    leaderboard: (params?: any) => ['xp', 'leaderboard', params] as const,
  },

  // Achievements
  achievements: {
    all: () => ['achievements'] as const,
    my: () => ['achievements', 'my'] as const,
    detail: (id: string) => ['achievements', id] as const,
  },

  // Challenges
  challenges: {
    daily: () => ['challenges', 'daily'] as const,
    my: () => ['challenges', 'my'] as const,
    detail: (id: string) => ['challenges', id] as const,
  },

  // Streaks
  streaks: {
    my: () => ['streaks', 'my'] as const,
    leaderboard: () => ['streaks', 'leaderboard'] as const,
  },

  // Projects
  projects: {
    all: (params?: any) => ['projects', params] as const,
    my: () => ['projects', 'my'] as const,
    detail: (id: string) => ['projects', id] as const,
    milestones: (projectId: string) => ['projects', projectId, 'milestones'] as const,
  },

  // Events
  events: {
    all: (params?: any) => ['events', params] as const,
    my: () => ['events', 'my'] as const,
    detail: (id: string) => ['events', id] as const,
  },

  // Courses
  courses: {
    all: (params?: any) => ['courses', params] as const,
    my: () => ['courses', 'my'] as const,
    detail: (id: string) => ['courses', id] as const,
  },

  // Teams
  teams: {
    all: (params?: any) => ['teams', params] as const,
    my: () => ['teams', 'my'] as const,
    detail: (id: string) => ['teams', id] as const,
  },

  // Notifications
  notifications: {
    all: (params?: any) => ['notifications', params] as const,
    unread: () => ['notifications', 'unread'] as const,
    count: () => ['notifications', 'count'] as const,
  },
} as const;

export default APIClient;
