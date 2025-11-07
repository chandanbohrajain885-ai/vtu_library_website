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

// Hook for live data updates
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

  // Fetch data function
  const fetchData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      setError(null);

      const response = references && references.length > 0
        ? await BaseCrudService.getAll<T>(collectionId, references)
        : await BaseCrudService.getAll<T>(collectionId);

      if (mountedRef.current) {
        setData(response.items);
        setLastUpdated(new Date());
        setIsLoading(false);
      }
    } catch (err) {
      console.error(`Error fetching ${collectionId}:`, err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setIsLoading(false);
      }
    }
  }, [collectionId, references]);

  // Refresh function for manual updates
  const refresh = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  // Force refresh with loading state
  const forceRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Initial fetch
    fetchData(true);

    // Subscribe to data update events
    const unsubscribe = dataUpdateEmitter.subscribe(collectionId, refresh);

    // Set up polling
    if (pollInterval > 0) {
      pollIntervalRef.current = setInterval(() => {
        fetchData(false);
      }, pollInterval);
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