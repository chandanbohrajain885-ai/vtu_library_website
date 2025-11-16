import { create } from 'zustand';
import { BaseCrudService } from '@/integrations';
import { EResources, NewsandEvents, UserGuideArticles, LibrarianFileUploads, LibrarianAccounts, PasswordChangeRequests } from '@/entities';
import { useEffect } from 'react';

interface GlobalDataState {
  // Data
  eResources: EResources[];
  news: NewsandEvents[];
  userGuides: UserGuideArticles[];
  uploads: LibrarianFileUploads[];
  accounts: LibrarianAccounts[];
  passwordRequests: PasswordChangeRequests[];
  
  // Loading states
  isLoading: boolean;
  lastUpdated: Record<string, Date>;
  
  // Actions
  fetchEResources: () => Promise<void>;
  fetchNews: () => Promise<void>;
  fetchUserGuides: () => Promise<void>;
  fetchUploads: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  fetchPasswordRequests: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  
  // Cache management
  isCacheValid: (collection: string, maxAge: number) => boolean;
}

export const useGlobalDataStore = create<GlobalDataState>((set, get) => ({
  // Initial state
  eResources: [],
  news: [],
  userGuides: [],
  uploads: [],
  accounts: [],
  passwordRequests: [],
  isLoading: false,
  lastUpdated: {},

  // Cache validation
  isCacheValid: (collection: string, maxAge: number) => {
    const lastUpdate = get().lastUpdated[collection];
    if (!lastUpdate) return false;
    return Date.now() - lastUpdate.getTime() < maxAge;
  },

  // Fetch functions with caching
  fetchEResources: async () => {
    if (get().isCacheValid('eResources', 300000)) return; // 5 min cache
    
    try {
      const { items } = await BaseCrudService.getAll<EResources>('E-Resources');
      set(state => ({
        eResources: items,
        lastUpdated: { ...state.lastUpdated, eResources: new Date() }
      }));
    } catch (error) {
      console.warn('Failed to fetch E-Resources:', error);
    }
  },

  fetchNews: async () => {
    if (get().isCacheValid('news', 60000)) return; // 1 min cache
    
    try {
      const { items } = await BaseCrudService.getAll<NewsandEvents>('newsandnotifications');
      set(state => ({
        news: items,
        lastUpdated: { ...state.lastUpdated, news: new Date() }
      }));
    } catch (error) {
      console.warn('Failed to fetch news:', error);
    }
  },

  fetchUserGuides: async () => {
    if (get().isCacheValid('userGuides', 600000)) return; // 10 min cache
    
    try {
      const { items } = await BaseCrudService.getAll<UserGuideArticles>('userguidearticles');
      set(state => ({
        userGuides: items,
        lastUpdated: { ...state.lastUpdated, userGuides: new Date() }
      }));
    } catch (error) {
      console.warn('Failed to fetch user guides:', error);
    }
  },

  fetchUploads: async () => {
    if (get().isCacheValid('uploads', 30000)) return; // 30 sec cache
    
    try {
      const { items } = await BaseCrudService.getAll<LibrarianFileUploads>('librarianfileuploads');
      set(state => ({
        uploads: items,
        lastUpdated: { ...state.lastUpdated, uploads: new Date() }
      }));
    } catch (error) {
      console.warn('Failed to fetch uploads:', error);
    }
  },

  fetchAccounts: async () => {
    if (get().isCacheValid('accounts', 600000)) return; // 10 min cache
    
    try {
      const { items } = await BaseCrudService.getAll<LibrarianAccounts>('librarianaccounts');
      set(state => ({
        accounts: items,
        lastUpdated: { ...state.lastUpdated, accounts: new Date() }
      }));
    } catch (error) {
      console.warn('Failed to fetch accounts:', error);
    }
  },

  fetchPasswordRequests: async () => {
    if (get().isCacheValid('passwordRequests', 120000)) return; // 2 min cache
    
    try {
      const { items } = await BaseCrudService.getAll<PasswordChangeRequests>('passwordchangerequests');
      set(state => ({
        passwordRequests: items,
        lastUpdated: { ...state.lastUpdated, passwordRequests: new Date() }
      }));
    } catch (error) {
      console.warn('Failed to fetch password requests:', error);
    }
  },

  fetchAllData: async () => {
    set({ isLoading: true });
    
    await Promise.allSettled([
      get().fetchEResources(),
      get().fetchNews(),
      get().fetchUserGuides(),
      get().fetchUploads(),
      get().fetchAccounts(),
      get().fetchPasswordRequests()
    ]);
    
    set({ isLoading: false });
  }
}));

// Auto-refresh hook with optimized intervals
export const useAutoRefresh = () => {
  const store = useGlobalDataStore();
  
  // Single interval for all data refreshing
  useEffect(() => {
    // Initial load
    store.fetchAllData();
    
    // Optimized refresh intervals
    const newsInterval = setInterval(() => store.fetchNews(), 60000); // 1 min
    const uploadsInterval = setInterval(() => store.fetchUploads(), 30000); // 30 sec
    const passwordInterval = setInterval(() => store.fetchPasswordRequests(), 120000); // 2 min
    const resourcesInterval = setInterval(() => store.fetchEResources(), 300000); // 5 min
    const guidesInterval = setInterval(() => store.fetchUserGuides(), 600000); // 10 min
    const accountsInterval = setInterval(() => store.fetchAccounts(), 600000); // 10 min
    
    return () => {
      clearInterval(newsInterval);
      clearInterval(uploadsInterval);
      clearInterval(passwordInterval);
      clearInterval(resourcesInterval);
      clearInterval(guidesInterval);
      clearInterval(accountsInterval);
    };
  }, []);
};