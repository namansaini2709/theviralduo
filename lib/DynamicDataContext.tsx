"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import { DEFAULT_PROJECTS, DEFAULT_FEEDBACK } from "./constants";

export interface Reel {
  id: string | number;
  [key: string]: unknown;
  trashType?: string;
  trashedAt?: number;
}

export interface Work {
  id: string | number;
  client: string;
  platform: string;
  views: string;
  color: string;
  gradient: string;
  thumbnail: string;
  logo?: string;
  video?: string;
  link?: string;
  watchMoreLink?: string;
  logoLink?: string;
  thumbnailPosition?: string;
  trashType?: string;
  trashedAt?: number;
}

export interface Feedback {
  id: string | number;
  title: string;
  quote: string;
  feedback: string;
  image: string;
  color: string;
  name?: string;
  points: string;
  stars: string;
  trashType?: string;
  trashedAt?: number;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface DynamicData {
  reels: Reel[];
  work: Work[];
  feedback: Feedback[];
  stats: Stat[];
  trash: (Work | Feedback | Reel)[];
}

interface DynamicDataContextType {
  data: DynamicData;
  addReel: (reel: Reel) => void;
  addWork: (work: Work) => void;
  updateWork: (work: Work) => void;
  removeWork: (id: number | string) => void;
  addFeedback: (feedback: Feedback) => void;
  updateFeedback: (feedback: Feedback) => void;
  removeFeedback: (id: number | string) => void;
  restoreFromTrash: (id: number | string) => void;
  permanentlyDelete: (id: number | string) => void;
  updateStats: (stats: Stat[]) => void;
  resetData: () => void;
}

const DynamicDataContext = createContext<DynamicDataContextType | undefined>(undefined);

export function DynamicDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DynamicData>({
    reels: [],
    work: DEFAULT_PROJECTS,
    feedback: DEFAULT_FEEDBACK.map((f, i) => ({ ...f, id: `def-f-${i}` })),
    stats: [
      { value: 1, suffix: "M+", label: "Views Generated" },
      { value: 5, suffix: "X", label: "Average Growth" },
      { value: 15, suffix: "+", label: "Brands Scaled" },
    ],
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
          if (parsed && typeof parsed === 'object') {
            setData({
            reels: parsed.reels || [],
            work: parsed.work && parsed.work.length > 0 ? parsed.work : DEFAULT_PROJECTS,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            feedback: parsed.feedback && parsed.feedback.length > 0 ? parsed.feedback : DEFAULT_FEEDBACK.map((f: any, i: number) => ({ ...f, id: `def-f-${i}` })),
            stats: parsed.stats || [
              { value: 1, suffix: "M+", label: "Views Generated" },
              { value: 5, suffix: "X", label: "Average Growth" },
              { value: 15, suffix: "+", label: "Brands Scaled" },
            ],
            trash: parsed.trash || [],
            });
          }
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

  const addReel = (reel: Reel) => {
    setData((prev) => ({ ...prev, reels: [...prev.reels, reel] }));
  };

  const addWork = (work: Work) => {
    setData((prev) => ({ ...prev, work: [...prev.work, work] }));
  };

  const updateWork = (work: Work) => {
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

  const addFeedback = (feedback: Feedback) => {
    setData((prev) => ({ ...prev, feedback: [...prev.feedback, feedback] }));
  };

  const updateFeedback = (feedback: Feedback) => {
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
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { trashType, trashedAt, ...originalItem } = itemToRestore;
      const newTrash = prev.trash.filter(t => t.id !== id);
      
      if (trashType === 'work') {
        return { ...prev, work: [...prev.work, originalItem as Work], trash: newTrash };
      } else {
        return { ...prev, feedback: [...prev.feedback, originalItem as Feedback], trash: newTrash };
      }
    });
  };

  const permanentlyDelete = (id: number | string) => {
    setData((prev) => ({
      ...prev,
      trash: prev.trash.filter(t => t.id !== id)
    }));
  };
  
  const updateStats = (stats: Stat[]) => {
    setData((prev) => ({ ...prev, stats }));
  };

  const resetData = () => {
    setData({ 
      reels: [], 
      work: DEFAULT_PROJECTS, 
      feedback: DEFAULT_FEEDBACK.map((f, i) => ({ ...f, id: `def-f-${i}` })),
      stats: [
        { value: 1, suffix: "M+", label: "Views Generated" },
        { value: 5, suffix: "X", label: "Average Growth" },
        { value: 15, suffix: "+", label: "Brands Scaled" },
      ],
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
      updateStats,
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
