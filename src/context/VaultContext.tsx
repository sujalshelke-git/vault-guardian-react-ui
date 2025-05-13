
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface VaultEntry {
  id: string;
  name: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VaultContextType {
  entries: VaultEntry[];
  isLoading: boolean;
  addEntry: (entry: Omit<VaultEntry, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateEntry: (entryId: string, updatedEntry: Partial<VaultEntry>) => Promise<void>;
  deleteEntry: (entryId: string) => Promise<void>;
  searchEntries: (query: string) => VaultEntry[];
  encryptPassword: (password: string) => string;
  decryptPassword: (encryptedPassword: string) => string;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, we would use a proper encryption library
  // This is just a simple simulation for demo purposes
  const encryptPassword = (password: string): string => {
    // Simple base64 "encryption" for demo only
    // In production, use proper encryption libraries
    return btoa(password);
  };

  const decryptPassword = (encryptedPassword: string): string => {
    // Simple base64 "decryption" for demo only
    try {
      return atob(encryptedPassword);
    } catch (e) {
      return encryptedPassword;
    }
  };

  // Load entries from localStorage on init
  useEffect(() => {
    if (isAuthenticated) {
      const storedEntries = localStorage.getItem("secureVault_vault");
      if (storedEntries) {
        try {
          const parsedEntries = JSON.parse(storedEntries);
          // Convert string dates back to Date objects
          const formattedEntries = parsedEntries.map((entry: any) => ({
            ...entry,
            createdAt: new Date(entry.createdAt),
            updatedAt: new Date(entry.updatedAt)
          }));
          setEntries(formattedEntries);
        } catch (e) {
          console.error("Error parsing vault entries", e);
          setEntries([]);
        }
      } else {
        // Initialize with sample data for demo
        const sampleEntries = [
          {
            id: "1",
            name: "Google",
            username: "user@example.com",
            password: encryptPassword("demoPassword123"),
            url: "https://google.com",
            category: "Social",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "2",
            name: "GitHub",
            username: "developer",
            password: encryptPassword("securePass!456"),
            url: "https://github.com",
            category: "Development",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        setEntries(sampleEntries);
        localStorage.setItem("secureVault_vault", JSON.stringify(sampleEntries));
      }
    } else {
      setEntries([]);
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated && entries.length > 0) {
      localStorage.setItem("secureVault_vault", JSON.stringify(entries));
    }
  }, [entries, isAuthenticated]);

  const addEntry = async (entry: Omit<VaultEntry, "id" | "createdAt" | "updatedAt">): Promise<void> => {
    const now = new Date();
    const newEntry: VaultEntry = {
      ...entry,
      id: "entry_" + Math.random().toString(36).substr(2, 9),
      password: encryptPassword(entry.password),
      createdAt: now,
      updatedAt: now
    };

    setEntries(prev => [...prev, newEntry]);
    toast({
      title: "Entry added",
      description: `"${entry.name}" has been added to your vault`,
    });
  };

  const updateEntry = async (entryId: string, updatedEntry: Partial<VaultEntry>): Promise<void> => {
    setEntries(prev => 
      prev.map(entry => {
        if (entry.id === entryId) {
          // Encrypt password if it's being updated
          const passwordToSave = updatedEntry.password 
            ? encryptPassword(updatedEntry.password) 
            : entry.password;
          
          return {
            ...entry,
            ...updatedEntry,
            password: passwordToSave,
            updatedAt: new Date()
          };
        }
        return entry;
      })
    );
    
    toast({
      title: "Entry updated",
      description: "Your vault entry has been updated",
    });
  };

  const deleteEntry = async (entryId: string): Promise<void> => {
    const entryToDelete = entries.find(entry => entry.id === entryId);
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
    
    toast({
      title: "Entry deleted",
      description: entryToDelete ? `"${entryToDelete.name}" has been removed` : "Entry has been removed",
    });
  };

  const searchEntries = (query: string): VaultEntry[] => {
    if (!query.trim()) return entries;
    
    const lowercaseQuery = query.toLowerCase();
    return entries.filter(entry => 
      entry.name.toLowerCase().includes(lowercaseQuery) ||
      entry.username.toLowerCase().includes(lowercaseQuery) ||
      (entry.url && entry.url.toLowerCase().includes(lowercaseQuery)) ||
      (entry.category && entry.category.toLowerCase().includes(lowercaseQuery)) ||
      (entry.notes && entry.notes.toLowerCase().includes(lowercaseQuery))
    );
  };

  return (
    <VaultContext.Provider value={{
      entries,
      isLoading,
      addEntry,
      updateEntry,
      deleteEntry,
      searchEntries,
      encryptPassword,
      decryptPassword
    }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
