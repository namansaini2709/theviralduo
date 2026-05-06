"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface DynamicData {
  reels: any[];
  work: any[];
  feedback: any[];
  brands: any[];
  results: any[];
  trash: any[];
}

interface DynamicDataContextType {
  data: DynamicData;
  addReel: (reel: any) => void;
  addWork: (work: any) => void;
  updateWork: (work: any) => void;
  removeWork: (id: number) => void;
  addFeedback: (feedback: any) => void;
  updateFeedback: (feedback: any) => void;
  removeFeedback: (id: number) => void;
  addBrand: (brand: any) => void;
  updateBrand: (brand: any) => void;
  removeBrand: (id: number) => void;
  addResult: (result: any) => void;
  updateResult: (result: any) => void;
  removeResult: (id: number) => void;
  moveWork: (id: number, direction: 'up' | 'down') => void;
  moveFeedback: (id: number, direction: 'up' | 'down') => void;
  moveBrand: (id: number, direction: 'up' | 'down') => void;
  moveResult: (id: number, direction: 'up' | 'down') => void;
  restoreItem: (id: number) => void;
  permanentlyDeleteItem: (id: number) => void;
  resetData: () => void;
  resetToDefaults: () => void;
}

const INITIAL_DATA: DynamicData = {
  reels: [],
  work: [
    {
      id: 1,
      client: "Anytime Fitness",
      platform: "Instagram Reels",
      views: "1.2M",
      color: "#8E24AA",
      gradient: "from-purple-900/50 to-black",
      thumbnail: "/assets/projects/anytime-fitness.jpg",
      thumbnailPosition: "top center",
      logo: "/assets/projects/anytime-fitness-logo.jpg",
      video: "/assets/projects/anytime-fitness.mp4",
      link: "https://www.instagram.com/reel/DUXvwuHkt9F/",
      watchMoreLink: "https://www.instagram.com/anytimefitnessshahdaradelhi/reels/?hl=en",
      logoLink: "https://www.instagram.com/anytimefitnessshahdaradelhi/?hl=en",
    },
    {
      id: 2,
      client: "Vdmc",
      platform: "Corporate Video",
      views: "850K",
      color: "#1E88E5",
      gradient: "from-blue-900/50 to-black",
      thumbnail: "/assets/projects/vdmc-thumb.png",
      thumbnailPosition: "top center",
      logo: "/assets/projects/vdmc-logo.jpg",
      video: "/assets/projects/vdmc.mp4",
      link: "https://www.instagram.com/reel/DXJzPiKCK3M/",
      watchMoreLink: "https://www.instagram.com/vdmc_malai_chaap_nsfood/reels/?hl=en",
      logoLink: "https://www.instagram.com/vdmc_malai_chaap_nsfood/?hl=en",
    },
    {
      id: 3,
      client: "Make your trip possible",
      platform: "Travel Film",
      views: "2.1M",
      color: "#F4511E",
      gradient: "from-orange-900/50 to-black",
      thumbnail: "/assets/projects/make-your-trip-possible.jpg",
      video: "/assets/projects/make-your-trips-possible.mp4",
      logo: "/assets/projects/make-your-trip-possible-logo.jpg",
      link: "https://www.instagram.com/makeyourtrippossible?igsh=b2lxeTdobDhwZHht",
      logoLink: "https://www.instagram.com/makeyourtrippossible?igsh=b2lxeTdobDhwZHht",
    },
    {
      id: 4,
      client: "FOF Fitness",
      platform: "TikTok",
      views: "1.5M",
      color: "#43A047",
      gradient: "from-green-900/50 to-black",
      thumbnail: "/assets/projects/fof-fitness.png",
      logo: "/assets/projects/fof-fitness-logo.jpeg",
      video: "/assets/projects/fof-fitness.mp4",
      link: "https://www.instagram.com/reel/DXVqVftE2rS/",
      watchMoreLink: "https://www.instagram.com/foffitnesa/reels/",
      logoLink: "https://www.instagram.com/foffitnesa/",
    },
    {
      id: 5,
      client: "Sharma ke bhature",
      platform: "Food Vlog",
      views: "3.4M",
      color: "#FB8C00",
      gradient: "from-amber-900/50 to-black",
      thumbnail: "/assets/projects/skb-thumb.jpg",
      video: "/assets/projects/skb-video.mp4",
      logo: "/assets/projects/sharma-ke-bhature-logo.jpg",
      link: "https://www.instagram.com/reel/DXVwQYHEmqw/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
      logoLink: "https://www.instagram.com/reel/DXVwQYHEmqw/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
    },
    {
      id: 6,
      client: "Radhe krishna",
      platform: "Spiritual Reel",
      views: "4.2M",
      color: "#D81B60",
      gradient: "from-pink-900/50 to-black",
      thumbnail: "/assets/projects/radhe-krishna-thumb.jpg",
      video: "/assets/projects/radhe-krishna-video.mp4",
      logo: "/assets/projects/radhe-krishna-logo.jpg",
      link: "https://www.instagram.com/reel/DXBnqYQkiwW/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      logoLink: "https://www.instagram.com/shri_radheykrishnajewellers?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    },
    {
      id: 7,
      client: "Global holidays",
      platform: "Adventure Film",
      views: "920K",
      color: "#00ACC1",
      gradient: "from-cyan-900/50 to-black",
      thumbnail: "/assets/projects/global-holidays-thumb.jpg",
      logo: "/assets/projects/global-holidays-logo.png",
      video: "/assets/projects/global-holidays-video.mp4",
      link: "https://www.instagram.com/reel/DXtZpZDTCrB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      logoLink: "https://www.instagram.com/reel/DXtZpZDTCrB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    },
    {
      id: 8,
      client: "City gym",
      platform: "Workout Reel",
      views: "1.1M",
      color: "#546E7A",
      gradient: "from-slate-900/50 to-black",
      thumbnail: "/assets/projects/city-gym-thumb.jpg",
      video: "/assets/projects/city-gym-video.mp4",
      logo: "/assets/projects/city-gym-logo.jpg",
      link: "https://www.instagram.com/reel/DXOoUHJkfHy/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      logoLink: "https://www.instagram.com/citygym.16?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    },
    {
      id: 9,
      client: "Saral",
      platform: "Instagram Reels",
      views: "2.3M",
      color: "#FF4D6D",
      gradient: "from-red-900/50 to-black",
      thumbnail: "/assets/projects/saral-gym-thumb.jpg",
      video: "/assets/projects/saral-gym.mp4",
      logo: "/assets/projects/saral-gym-logo.jpg",
      link: "https://www.instagram.com/reel/DXUHP30k_Xl/",
      watchMoreLink: "https://www.instagram.com/_saralgym_/reels/",
      logoLink: "https://www.instagram.com/_saralgym_/",
    },
    {
      id: 10,
      client: "Career launcher",
      platform: "Education Promo",
      views: "1.8M",
      color: "#3949AB",
      gradient: "from-indigo-900/50 to-black",
      thumbnail: "/assets/projects/career-launcher-thumb.jpg",
      video: "/assets/projects/career-launcher-video.mp4",
      logo: "/assets/projects/career-launcher-logo.jpg",
      link: "https://www.instagram.com/cl_ashokvihar?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      logoLink: "https://www.instagram.com/cl_ashokvihar?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    },
  ],
  feedback: [
    {
      id: 11,
      title: "Sharma ji ke bhature",
      quote: "Pure sheher mein dhoom macha di!",
      image: "/logos/Sharma ji ke bhature.JPG",
      feedback: "Bhai wah! Inke videos ke baad log dur-dur se hamare bhature khane aa rahe hain. Food cinematography top class hai. Viral Duo ne toh kamaal kar diya!",
      points: "FOOD, LOCAL IMPACT, VIRAL",
      stars: "5"
    },
    {
      id: 12,
      title: "Shri radhey Krishna jewellers",
      quote: "Jewelry ki chamak ab digital bhi.",
      image: "/logos/Shri radhey Krishna  jewellers.JPG",
      feedback: "Hamari jewelry ki khubsurti ko inho ne screen par utaar diya. Trusted partners for our digital journey. Inka kaam bahut hi safayi aur imandari wala hai.",
      points: "LUXURY, TRUST, ELEGANCE",
      stars: "5"
    },
    {
      id: 13,
      title: "Global Holidays",
      quote: "Travel reels ka koi muqabla nahi.",
      image: "/logos/Global Holidays.PNG",
      feedback: "They captured our tour packages so beautifully that bookings increased by 40%. Bahut hi professional team hai, har cheez waqt par deliver ki.",
      points: "TRAVEL, BOOKINGS, PROFESSIONAL",
      stars: "5"
    },
    {
      id: 14,
      title: "FOF Fitnesa",
      quote: "Viral Duo ne toh dhamal macha diya!",
      image: "/logos/FOF Fitnesa logo.jpeg",
      feedback: "Inki cinematic fitness videos dekh kar hamara gym full ho gaya hai. Quality aur vision dono kamaal ke hain. Best investment for our brand.",
      points: "FITNESS, VIRAL, QUALITY",
      stars: "5"
    },
    {
      id: 15,
      title: "Career Launcher",
      quote: "Education simplified through visuals.",
      image: "/logos/carrer launcher.JPG",
      feedback: "They made learning look cool. Our student engagement has never been higher. Bahut hi shandar kaam, education industry mein aisa vision pehle nahi dekha.",
      points: "EDTECH, ENGAGEMENT, CREATIVE",
      stars: "5"
    },
    {
      id: 16,
      title: "MS Classes",
      quote: "Growth in every frame.",
      image: "/logos/ms classes.JPG",
      feedback: "Inki strategy aur cinematic sense ne hamare coaching center ko ek naya mod diya hai. Students are loving the new content. Highly impressed!",
      points: "EDUCATION, STRATEGY, GROWTH",
      stars: "5"
    },
    {
      id: 17,
      title: "Saral Gym",
      quote: "Fitness ko saral aur viral banaya.",
      image: "/logos/saral gym logo.jpg",
      feedback: "Amazing transformation of our social media. Reels are getting millions of views. Inka content creation process bahut hi smooth aur creative hai.",
      points: "VIRAL, FITNESS, MILLIONS",
      stars: "5"
    },
    {
      id: 18,
      title: "VDMC",
      quote: "Reliable and Creative team.",
      image: "/logos/Vdmc logo.JPG",
      feedback: "Working with Viral Duo was a breeze. They delivered more than what they promised. Professionalism at its peak in the Indian market.",
      points: "CREATIVE, RELIABLE, FAST",
      stars: "5"
    },
    {
      id: 19,
      title: "Anytime Fitness",
      quote: "Global standards, Indian heart.",
      image: "/logos/anytime. fitness logos.JPG",
      feedback: "The cinematic reels they created for our brand were international level. They really understand what the audience wants to see. Top class!",
      points: "GLOBAL, FITNESS, ELITE",
      stars: "5"
    },
    {
      id: 20,
      title: "MAKE YOUR TRIP POSSIBLE",
      quote: "Desi travelers ke liye best content creator.",
      image: "/logos/Make your trip possible.jpg",
      feedback: "Indian scenery ko cinematic banana inki khoobi hai. Our travel packages sold out for the season thanks to their viral reels. Super proud of this partnership!",
      points: "CINEMATIC, TRAVEL GOALS, PREMIUM",
      stars: "5"
    }
  ],
  brands: [
    { id: 1, name: "FOF Fitness", logo: "/logos/FOF Fitnesa logo.jpeg" },
    { id: 2, name: "Global Holidays", logo: "/logos/Global Holidays.PNG" },
    { id: 3, name: "Make your trip possible", logo: "/logos/Make your trip possible.jpg" },
    { id: 4, name: "Sharma ji ke bhature", logo: "/logos/Sharma ji ke bhature.JPG" },
    { id: 5, name: "Shri radhey Krishna jewellers", logo: "/logos/Shri radhey Krishna  jewellers.JPG" },
    { id: 6, name: "VDMC", logo: "/logos/Vdmc logo.JPG" },
    { id: 7, name: "Anytime Fitness", logo: "/logos/anytime. fitness logos.JPG" },
    { id: 8, name: "Career Launcher", logo: "/logos/carrer launcher.JPG" },
    { id: 9, name: "MS Classes", logo: "/logos/ms classes.JPG" },
    { id: 10, name: "Saral Gym", logo: "/logos/saral gym logo.jpg" },
  ],
  results: [
    { id: 1, value: 1, suffix: "M+", label: "Views Generated" },
    { id: 2, value: 5, suffix: "X", label: "Average Growth" },
    { id: 3, value: 15, suffix: "+", label: "Brands Scaled" },
  ],
  trash: [],
};

const DynamicDataContext = createContext<DynamicDataContextType | undefined>(undefined);

export function DynamicDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DynamicData>(INITIAL_DATA);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("viralDuoDynamicData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Merge saved data with initial data to ensure new keys are populated if MISSING
        setData({
          reels: (parsed.reels !== undefined) ? parsed.reels : INITIAL_DATA.reels,
          work: (parsed.work !== undefined) ? parsed.work : INITIAL_DATA.work,
          feedback: (parsed.feedback !== undefined) ? parsed.feedback : INITIAL_DATA.feedback,
          brands: (parsed.brands !== undefined) ? parsed.brands : INITIAL_DATA.brands,
          results: (parsed.results !== undefined) ? parsed.results : INITIAL_DATA.results,
          trash: parsed.trash || [],
        });
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "viralDuoDynamicData" && e.newValue) {
        try {
          setData(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to parse storage update", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
      work: prev.work.map(w => w.id === work.id ? work : w)
    }));
  };

  const removeWork = (id: number) => {
    setData((prev) => {
      const itemToDelete = prev.work.find(w => w.id === id);
      if (!itemToDelete) return prev;
      return {
        ...prev,
        work: prev.work.filter(w => w.id !== id),
        trash: [...prev.trash, { ...itemToDelete, __type: 'work' }]
      };
    });
  };

  const addFeedback = (feedback: any) => {
    setData((prev) => ({ ...prev, feedback: [...prev.feedback, feedback] }));
  };

  const updateFeedback = (feedback: any) => {
    setData((prev) => ({
      ...prev,
      feedback: prev.feedback.map(f => f.id === feedback.id ? feedback : f)
    }));
  };

  const removeFeedback = (id: number) => {
    setData((prev) => {
      const itemToDelete = prev.feedback.find(f => f.id === id);
      if (!itemToDelete) return prev;
      return {
        ...prev,
        feedback: prev.feedback.filter(f => f.id !== id),
        trash: [...prev.trash, { ...itemToDelete, __type: 'feedback' }]
      };
    });
  };

  const addBrand = (brand: any) => {
    setData((prev) => ({ ...prev, brands: [...prev.brands, brand] }));
  };

  const updateBrand = (brand: any) => {
    setData((prev) => ({
      ...prev,
      brands: prev.brands.map(b => b.id === brand.id ? brand : b)
    }));
  };

  const removeBrand = (id: number) => {
    setData((prev) => {
      const itemToDelete = prev.brands.find(b => b.id === id);
      if (!itemToDelete) return prev;
      return {
        ...prev,
        brands: prev.brands.filter(b => b.id !== id),
        trash: [...prev.trash, { ...itemToDelete, __type: 'brand' }]
      };
    });
  };

  const addResult = (result: any) => {
    setData((prev) => ({ ...prev, results: [...prev.results, result] }));
  };

  const updateResult = (result: any) => {
    setData((prev) => ({
      ...prev,
      results: prev.results.map(r => r.id === result.id ? result : r)
    }));
  };

  const removeResult = (id: number) => {
    setData((prev) => {
      const itemToDelete = prev.results.find(r => r.id === id);
      if (!itemToDelete) return prev;
      return {
        ...prev,
        results: prev.results.filter(r => r.id !== id),
        trash: [...prev.trash, { ...itemToDelete, __type: 'result' }]
      };
    });
  };

  const moveItem = (listKey: keyof DynamicData, id: number, direction: 'up' | 'down') => {
    setData((prev) => {
      const list = [...prev[listKey]];
      const index = list.findIndex((item: any) => item.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= list.length) return prev;
      
      const [movedItem] = list.splice(index, 1);
      list.splice(newIndex, 0, movedItem);
      
      return { ...prev, [listKey]: list };
    });
  };

  const moveWork = (id: number, direction: 'up' | 'down') => moveItem('work', id, direction);
  const moveFeedback = (id: number, direction: 'up' | 'down') => moveItem('feedback', id, direction);
  const moveBrand = (id: number, direction: 'up' | 'down') => moveItem('brands', id, direction);
  const moveResult = (id: number, direction: 'up' | 'down') => moveItem('results', id, direction);

  const restoreItem = (id: number) => {
    setData((prev) => {
      const itemToRestore = prev.trash.find(t => t.id === id);
      if (!itemToRestore) return prev;
      
      const { __type, ...rest } = itemToRestore;
      const newTrash = prev.trash.filter(t => t.id !== id);
      
      if (__type === 'work') {
        return { ...prev, trash: newTrash, work: [...prev.work, rest] };
      } else if (__type === 'feedback') {
        return { ...prev, trash: newTrash, feedback: [...prev.feedback, rest] };
      } else if (__type === 'brand') {
        return { ...prev, trash: newTrash, brands: [...prev.brands, rest] };
      } else if (__type === 'result') {
        return { ...prev, trash: newTrash, results: [...prev.results, rest] };
      }
      return prev;
    });
  };

  const permanentlyDeleteItem = (id: number) => {
    setData((prev) => ({
      ...prev,
      trash: prev.trash.filter(t => t.id !== id)
    }));
  };

  const resetData = () => {
    setData({ reels: [], work: [], feedback: [], brands: [], results: [], trash: [] });
    localStorage.removeItem("viralDuoDynamicData");
  };

  const resetToDefaults = () => {
    setData(INITIAL_DATA);
    localStorage.setItem("viralDuoDynamicData", JSON.stringify(INITIAL_DATA));
  };

  return (
    <DynamicDataContext.Provider value={{ data, addReel, addWork, updateWork, removeWork, addFeedback, updateFeedback, removeFeedback, addBrand, updateBrand, removeBrand, addResult, updateResult, removeResult, moveWork, moveFeedback, moveBrand, moveResult, restoreItem, permanentlyDeleteItem, resetData, resetToDefaults }}>
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
