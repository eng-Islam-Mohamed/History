import { create } from 'zustand';
import { HistoryTopic, SavedBook } from '@/types';
import { getSavedBooks, saveBook, removeBook } from '@/lib/storage';

interface AppState {
  // Search state
  searchQuery: string;
  isSearching: boolean;
  searchResult: HistoryTopic | null;
  searchError: string | null;
  
  // Library state
  savedBooks: SavedBook[];
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSearching: (loading: boolean) => void;
  setSearchResult: (result: HistoryTopic | null) => void;
  setSearchError: (error: string | null) => void;
  loadBooks: () => void;
  addBook: (topic: HistoryTopic) => void;
  deleteBook: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  searchQuery: '',
  isSearching: false,
  searchResult: null,
  searchError: null,
  savedBooks: [],

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearching: (loading) => set({ isSearching: loading }),
  setSearchResult: (result) => set({ searchResult: result, searchError: null }),
  setSearchError: (error) => set({ searchError: error, isSearching: false }),

  loadBooks: () => {
    const books = getSavedBooks();
    set({ savedBooks: books });
  },

  addBook: (topic) => {
    saveBook(topic);
    const books = getSavedBooks();
    set({ savedBooks: books });
  },

  deleteBook: (id) => {
    removeBook(id);
    const books = getSavedBooks();
    set({ savedBooks: books });
  },
}));
