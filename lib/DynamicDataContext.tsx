"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import { DEFAULT_PROJECTS } from "@/components/sections/MovieReel";
import { DEFAULT_FEEDBACK } from "@/components/sections/Polaroids";

interface DynamicData {
  reels: any[];
  work: any[];
  feedback: any[];
  trash: any[];
}

interface DynamicDataContextType {
  data: DynamicData;
  addReel: (reel: any) => void;
  addWork: (work: any) => void;
  updateWork: (work: any) => void;
  removeWork: (id: number | string) => void;
  addFeedback: (feedback: any) => void;
  updateFeedback: (feedback: any) => void;
  removeFeedback: (id: number | string) => void;
  restoreFromTrash: (id: number | string) => void;
  permanentlyDelete: (id: number | string) => void;
  resetData: () => void;
}

const DynamicDataContext = createContext<DynamicDataContextType | undefined>(undefined);

export function DynamicDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DynamicData>({
    reels: [],
    work: DEFAULT_PROJECTS,
    feedback: DEFAULT_FEEDBACK.map((f, i) => ({ ...f, id: `def-f-${i}` })),
    trash: [],
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem("viralDuoDynamicData");
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setData({
            reels: parsed.reels || [],
            work: parsed.work && parsed.work.length > 0 ? parsed.work : DEFAULT_PROJECTS,
            feedback: parsed.feedback && parsed.feedback.length > 0 ? parsed.feedback : DEFAULT_FEEDBACK.map((f: any, i: number) => ({ ...f, id: `def-f-${i}` })),
            trash: parsed.trash || [],
          });
        } catch (e) {
          console.error("Failed to parse dynamic data", e);
        }
      }
      setIsInitialized(true);
    };

    loadData();

    // Sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "viralDuoDynamicData") {
        const savedData = localStorage.getItem("viralDuoDynamicData");
        if (savedData) setData(JSON.parse(savedData));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save to local storage whenever data changes, but ONLY after initial load
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("viralDuoDynamicData", JSON.stringify(data));
    }
  }, [data, isInitialized]);

  const addReel = (reel: any) => {
    setData((prev) => ({ ...prev, reels: [...prev.reels, reel] }));
  };

  const addWork = (work: any) => {
    setData((prev) => ({ ...prev, work: [...prev.work, work] }));
  };

  const updateWork = (work: any) => {
    setData((prev) => ({
      ...prev,
      work: prev.work.map((w) => (w.id === work.id ? work : w)),
    }));
  };

  const removeWork = (id: number | string) => {
    setData((prev) => {
      const itemToTrash = prev.work.find(w => w.id === id);
      if (!itemToTrash) return prev;
      return {
        ...prev,
        work: prev.work.filter(w => w.id !== id),
        trash: [...prev.trash, { ...itemToTrash, trashType: 'work', trashedAt: Date.now() }]
      };
    });
  };

  const addFeedback = (feedback: any) => {
    setData((prev) => ({ ...prev, feedback: [...prev.feedback, feedback] }));
  };

  const updateFeedback = (feedback: any) => {
    setData((prev) => ({
      ...prev,
      feedback: prev.feedback.map((f) => (f.id === feedback.id ? feedback : f)),
    }));
  };

  const removeFeedback = (id: number | string) => {
    setData((prev) => {
      const itemToTrash = prev.feedback.find(f => f.id === id);
      if (!itemToTrash) return prev;
      return {
        ...prev,
        feedback: prev.feedback.filter(f => f.id !== id),
        trash: [...prev.trash, { ...itemToTrash, trashType: 'feedback', trashedAt: Date.now() }]
      };
    });
  };

  const restoreFromTrash = (id: number | string) => {
    setData((prev) => {
      const itemToRestore = prev.trash.find(t => t.id === id);
      if (!itemToRestore) return prev;
      
      const { trashType, trashedAt, ...originalItem } = itemToRestore;
      const newTrash = prev.trash.filter(t => t.id !== id);
      
      if (trashType === 'work') {
        return { ...prev, work: [...prev.work, originalItem], trash: newTrash };
      } else {
        return { ...prev, feedback: [...prev.feedback, originalItem], trash: newTrash };
      }
    });
  };

  const permanentlyDelete = (id: number | string) => {
    setData((prev) => ({
      ...prev,
      trash: prev.trash.filter(t => t.id !== id)
    }));
  };

  const resetData = () => {
    setData({ 
      reels: [], 
      work: DEFAULT_PROJECTS, 
      feedback: DEFAULT_FEEDBACK.map((f, i) => ({ ...f, id: `def-f-${i}` })),
      trash: []
    });
    localStorage.removeItem("viralDuoDynamicData");
  };

  return (
    <DynamicDataContext.Provider value={{ 
      data, 
      addReel, 
      addWork, 
      updateWork, 
      removeWork, 
      addFeedback, 
      updateFeedback, 
      removeFeedback,
      restoreFromTrash,
      permanentlyDelete,
      resetData 
    }}>
      {children}
    </DynamicDataContext.Provider>
  );
}

export function useDynamicData() {
  const context = useContext(DynamicDataContext);
  if (context === undefined) {
    throw new Error("useDynamicData must be used within a DynamicDataProvider");
  }
  return context;
}
