import { useState, useEffect, useCallback, useRef } from 'react';
import { BaseCrudService, WixDataItem } from '@/integrations';

// Global event emitter for cross-component communication
class DataUpdateEmitter {
  private listeners: Map<string, Set<() => void>> = new Map();

  subscribe(collection: string, callback: () => void) {
    if (!this.listeners.has(collection)) {
      this.listeners.set(collection, new Set());
    }
    this.listeners.get(collection)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(collection);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(collection);
        }
      }
    };
  }

  emit(collection: string) {
    const callbacks = this.listeners.get(collection);
    if (callbacks) {
      callbacks.forEach(callback => callback());
    }
  }

  // Emit to all collections
  emitAll() {
    this.listeners.forEach((callbacks) => {
      callbacks.forEach(callback => callback());
    });
  }
}

// Global instance
export const dataUpdateEmitter = new DataUpdateEmitter();

// Hook for live data updates with enhanced performance
export function useLiveData<T extends WixDataItem>(
  collectionId: string,
  references?: string[],
  pollInterval: number = 30000 // 30 seconds default
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const pollIntervalRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  const cacheRef = useRef<{ data: T[], timestamp: number } | null>(null);

  // Enhanced fetch data function with improved caching and performance optimizations
  const fetchData = useCallback(async (showLoading = false, useCache = false) => {
    try {
      // Improved cache logic for all collections with longer cache times
      if (useCache && cacheRef.current) {
        const cacheAge = Date.now() - cacheRef.current.timestamp;
        let cacheThreshold = 10000; // 10 seconds default (increased from 5s)
        
        // Different cache thresholds for different collections - increased for better performance
        if (collectionId === 'newsandnotifications') {
          cacheThreshold = 30000; // 30 seconds for news (increased from 10s)
        } else if (collectionId === 'E-Resources') {
          cacheThreshold = 60000; // 60 seconds for resources (increased from 30s)
        } else if (collectionId === 'userguidearticles') {
          cacheThreshold = 120000; // 2 minutes for guides (increased from 60s)
        } else if (collectionId === 'librarianfileuploads') {
          cacheThreshold = 20000; // 20 seconds for uploads
        } else if (collectionId === 'passwordchangerequests') {
          cacheThreshold = 45000; // 45 seconds for password requests
        }
        
        if (cacheAge < cacheThreshold) {
          if (mountedRef.current) {
            setData(cacheRef.current.data);
            setIsLoading(false);
            setLastUpdated(new Date(cacheRef.current.timestamp));
          }
          return;
        }
      }

      if (showLoading) setIsLoading(true);
      setError(null);

      const response = references && references.length > 0
        ? await BaseCrudService.getAll<T>(collectionId, references)
        : await BaseCrudService.getAll<T>(collectionId);

      // Cache the result for all collections
      cacheRef.current = {
        data: response.items,
        timestamp: Date.now()
      };

      if (mountedRef.current) {
        setData(response.items);
        setLastUpdated(new Date());
        setIsLoading(false);
      }
    } catch (err) {
      // Reduced console logging for better performance
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setIsLoading(false);
        // Don't clear data on error, keep the last successful fetch
      }
    }
  }, [collectionId, references]);

  // Enhanced refresh function
  const refresh = useCallback(() => {
    fetchData(false, false); // Don't use cache on manual refresh
  }, [fetchData]);

  // Force refresh with loading state
  const forceRefresh = useCallback(() => {
    fetchData(true, false); // Don't use cache on force refresh
  }, [fetchData]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Initial fetch with cache check for better performance
    fetchData(true, true);

    // Subscribe to data update events
    const unsubscribe = dataUpdateEmitter.subscribe(collectionId, refresh);

    // Set up optimized polling based on collection type with longer intervals
    if (pollInterval > 0) {
      pollIntervalRef.current = setInterval(() => {
        // Use cache for background polling to reduce server load and improve performance
        fetchData(false, true); // Always use cache for background polling
      }, Math.max(pollInterval, 15000)); // Minimum 15 seconds for any polling to reduce server load
    }

    // Cleanup
    return () => {
      mountedRef.current = false;
      unsubscribe();
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [collectionId, pollInterval, fetchData, refresh]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refresh,
    forceRefresh
  };
}

// Hook for triggering updates after CRUD operations
export function useDataUpdater() {
  const triggerUpdate = useCallback((collectionId: string) => {
    dataUpdateEmitter.emit(collectionId);
  }, []);

  const triggerGlobalUpdate = useCallback(() => {
    dataUpdateEmitter.emitAll();
  }, []);

  return {
    triggerUpdate,
    triggerGlobalUpdate
  };
}

// Enhanced CRUD service with auto-update triggers
export class LiveCrudService {
  static async create<T extends WixDataItem>(collectionId: string, data: Partial<T>): Promise<T> {
    const result = await BaseCrudService.create<T>(collectionId, data as T);
    dataUpdateEmitter.emit(collectionId);
    return result;
  }

  static async update<T extends WixDataItem>(collectionId: string, data: Partial<T> & { _id: string }): Promise<T> {
    const result = await BaseCrudService.update<T>(collectionId, data as T);
    dataUpdateEmitter.emit(collectionId);
    return result;
  }

  static async delete<T extends WixDataItem>(collectionId: string, id: string): Promise<void> {
    await BaseCrudService.delete<T>(collectionId, id);
    dataUpdateEmitter.emit(collectionId);
  }

  // Batch operations
  static async batchCreate<T extends WixDataItem>(collectionId: string, items: Partial<T>[]): Promise<T[]> {
    const results = await Promise.all(
      items.map(item => BaseCrudService.create<T>(collectionId, item as T))
    );
    dataUpdateEmitter.emit(collectionId);
    return results;
  }

  static async batchDelete<T extends WixDataItem>(collectionId: string, ids: string[]): Promise<void> {
    await Promise.all(
      ids.map(id => BaseCrudService.delete<T>(collectionId, id))
    );
    dataUpdateEmitter.emit(collectionId);
  }
}