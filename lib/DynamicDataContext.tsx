"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface DynamicData {
  reels: any[];
  work: any[];
  feedback: any[];
}

interface DynamicDataContextType {
  data: DynamicData;
  addReel: (reel: any) => void;
  addWork: (work: any) => void;
  removeWork: (id: number) => void;
  addFeedback: (feedback: any) => void;
  removeFeedback: (id: number) => void;
  resetData: () => void;
}

const DynamicDataContext = createContext<DynamicDataContextType | undefined>(undefined);

export function DynamicDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DynamicData>({
    reels: [],
    work: [],
    feedback: [],
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem("viralDuoDynamicData");
      if (savedData) {
        try {
          setData(JSON.parse(savedData));
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

  const removeWork = (id: number) => {
    setData((prev) => ({ ...prev, work: prev.work.filter(w => w.id !== id) }));
  };

  const addFeedback = (feedback: any) => {
    setData((prev) => ({ ...prev, feedback: [...prev.feedback, feedback] }));
  };

  const removeFeedback = (id: number) => {
    setData((prev) => ({ ...prev, feedback: prev.feedback.filter(f => f.id !== id) }));
  };

  const resetData = () => {
    setData({ reels: [], work: [], feedback: [] });
    localStorage.removeItem("viralDuoDynamicData");
  };

  return (
    <DynamicDataContext.Provider value={{ data, addReel, addWork, removeWork, addFeedback, removeFeedback, resetData }}>
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
