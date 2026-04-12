// context/SavedItemsContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export interface SavedItem {
  id: string;
  product_id: string;
  product: {
    name: string;
    price: string;
    image_urls: string[];
    is_active: boolean;
  };
}

interface SavedItemsContextValue {
  savedItems: SavedItem[];
  isLoading: boolean;
  toggleSavedItem: (productId: string) => Promise<void>;
  isSaved: (productId: string) => boolean;
}

const SavedItemsContext = createContext<SavedItemsContextValue | undefined>(undefined);

export function SavedItemsProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchSavedItems = async () => {
    try {
      const response = await api.get<SavedItem[]>("/api/v1/saved-items/");
      setSavedItems(response.data);
    } catch (error) {
      console.error("Failed to fetch saved items:", error);
      setSavedItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync when user logs in/out
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token || !user) {
      setSavedItems([]);
      setIsLoading(false);
      return;
    }
    fetchSavedItems();
  }, [user]);

  // Helper to easily check if a heart should be filled
  const isSaved = (productId: string) => {
    return savedItems.some((item) => item.product_id === productId);
  };

  // Smart toggle: Adds if missing, removes if present
  const toggleSavedItem = async (productId: string) => {
    if (!user) {
      toast.error("Please sign in to save items.");
      return;
    }

    const currentlySaved = isSaved(productId);

    try {
      if (currentlySaved) {
        // Optimistic UI update
        setSavedItems((prev) => prev.filter((item) => item.product_id !== productId));
        await api.delete(`/api/v1/saved-items/${productId}`);
        toast.success("Removed from Saved Items");
      } else {
        await api.post("/api/v1/saved-items/", { product_id: productId });
        await fetchSavedItems(); // Re-fetch to get the full product details
        toast.success("Added to Saved Items");
      }
    } catch (error) {
      console.error("Failed to toggle saved item:", error);
      toast.error("An error occurred. Please try again.");
      fetchSavedItems(); // Revert optimistic update on failure
    }
  };

  return (
    <SavedItemsContext.Provider value={{ savedItems, isLoading, toggleSavedItem, isSaved }}>
      {children}
    </SavedItemsContext.Provider>
  );
}

export function useSavedItems() {
  const context = useContext(SavedItemsContext);
  if (!context) {
    throw new Error("useSavedItems must be used within a SavedItemsProvider");
  }
  return context;
}