"use client";

import React, { useState } from "react";
import { useDynamicData } from "@/lib/DynamicDataContext";
import { DEFAULT_PROJECTS } from "@/components/sections/MovieReel";
import { DEFAULT_FEEDBACK } from "@/components/sections/Polaroids";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { addWork, removeWork, updateWork, addFeedback, updateFeedback, removeFeedback, resetData, data } = useDynamicData();
  
  const [editingWorkId, setEditingWorkId] = useState<number | string | null>(null);
  const [editingFeedbackId, setEditingFeedbackId] = useState<number | string | null>(null);

  React.useEffect(() => {
    if (sessionStorage.getItem("viralDuoAdminSession") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Project form state
  const [client, setClient] = useState("");
  const [platform, setPlatform] = useState("");
  const [views, setViews] = useState("");
  const [color, setColor] = useState("#E63946");
  const [thumbnail, setThumbnail] = useState("");
  const [logo, setLogo] = useState("");
  const [video, setVideo] = useState("");
  const [link, setLink] = useState("");
  const [watchMoreLink, setWatchMoreLink] = useState("");
  const [logoLink, setLogoLink] = useState("");

  // Feedback form state
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [feedbackBody, setFeedbackBody] = useState("");
  const [image, setImage] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("#F5F0E8");
  const [name, setName] = useState("");
  const [points, setPoints] = useState("");
  const [stars, setStars] = useState("5");

  const handleEditWork = (item: any) => {
    setEditingWorkId(item.id);
    setClient(item.client || "");
    setPlatform(item.platform || "");
    setViews(item.views || "");
    setColor(item.color || "#E63946");
    setThumbnail(item.thumbnail || "");
    setLogo(item.logo || "");
    setVideo(item.video || "");
    setLink(item.link || "");
    setWatchMoreLink(item.watchMoreLink || "");
    setLogoLink(item.logoLink || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditFeedback = (item: any) => {
    setEditingFeedbackId(item.id);
    setTitle(item.title || "");
    setQuote(item.quote || "");
    setFeedbackBody(item.feedback || "");
    setImage(item.image || "");
    setFeedbackColor(item.color || "#F5F0E8");
    setName(item.name || item.title || "");
    setPoints(item.points || "");
    setStars(item.stars || "5");
    // Scroll to the feedback section
    const feedbackForm = document.getElementById('feedback-form');
    feedbackForm?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("viralDuoAdminSession", "true");
    } else {
      alert("Incorrect password");
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !platform) return alert("Client and platform are required");
    
    const projectData = {
      id: editingWorkId || Date.now(),
      client,
      platform,
      views,
      color,
      gradient: `from-[${color}]/50 to-black`,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
      logo,
      video,
      link,
      watchMoreLink,
      logoLink,
      thumbnailPosition: "center",
    };

    if (editingWorkId !== null) {
      updateWork(projectData);
      setEditingWorkId(null);
    } else {
      addWork(projectData);
    }

    setClient("");
    setPlatform("");
    setViews("");
    setThumbnail("");
    setLogo("");
    setVideo("");
    setLink("");
    setWatchMoreLink("");
    setLogoLink("");
    alert(editingWorkId ? "Project updated successfully!" : "Project added successfully!");
  };

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote || !name) return alert("Quote and name are required");

    const feedbackData = {
      id: editingFeedbackId || Date.now(),
      title: title || name,
      quote,
      feedback: feedbackBody || quote,
      image: image || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
      color: feedbackColor,
      name,
      points,
      stars,
    };

    if (editingFeedbackId !== null) {
      updateFeedback(feedbackData);
      setEditingFeedbackId(null);
    } else {
      addFeedback(feedbackData);
    }

    setTitle("");
    setQuote("");
    setFeedbackBody("");
    setImage("");
    setName("");
    setPoints("");
    setStars("5");
    alert(editingFeedbackId ? "Feedback updated successfully!" : "Feedback added successfully!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-[#111] p-8 rounded-2xl border border-white/10 w-full max-w-md">
          <h1 className="text-white text-2xl mb-6 font-display">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password (admin123)"
            className="w-full bg-black border border-white/20 text-white p-3 rounded-lg mb-4 outline-none focus:border-red-500 transition-colors"
          />
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-bold transition-colors">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-display font-black">Control Panel</h1>
            <p className="text-white/50 mt-2">Manage dynamic content for the Viral Duo website</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                sessionStorage.removeItem("viralDuoAdminSession");
                setIsAuthenticated(false);
              }}
              className="px-4 py-2 border border-white/20 text-white/50 rounded-lg hover:bg-white/5 transition-colors"
            >
              Logout
            </button>
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to delete ALL dynamic data? This cannot be undone.")) {
                  resetData();
                }
              }}
              className="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Reset All Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Projects Section */}
          <div className="space-y-8">
            <div id="project-form" className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display">{editingWorkId ? "Update Project" : "Add New Project"}</h2>
                {editingWorkId && (
                  <button 
                    onClick={() => {
                      setEditingWorkId(null);
                      setClient("");
                      setPlatform("");
                      setViews("");
                      setThumbnail("");
                      setLogo("");
                      setVideo("");
                      setLink("");
                      setWatchMoreLink("");
                      setLogoLink("");
                    }}
                    className="text-xs text-white/40 hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={handleAddProject} className="space-y-4">
                {/* ... fields ... (keep existing) */}
                <div>
                  <label className="block text-xs text-white/50 mb-1">Client Name*</label>
                  <input required value={client} onChange={(e) => setClient(e.target.value)} className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Platform/Type*</label>
                  <input required value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="e.g. Instagram Reels" className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Views</label>
                    <input value={views} onChange={(e) => setViews(e.target.value)} placeholder="e.g. 1.2M" className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Brand Color</label>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-[38px] bg-black border border-white/20 p-1 rounded cursor-pointer" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1">Thumbnail</label>
                  <div className="flex gap-2">
                    <input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="Image URL" className="flex-1 bg-black border border-white/20 p-2 rounded text-sm" />
                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-2 rounded text-xs flex items-center transition-colors">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setThumbnail(URL.createObjectURL(file));
                      }} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1">Logo</label>
                  <div className="flex gap-2">
                    <input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="Image URL" className="flex-1 bg-black border border-white/20 p-2 rounded text-sm" />
                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-2 rounded text-xs flex items-center transition-colors">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setLogo(URL.createObjectURL(file));
                      }} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1">Video (.mp4)</label>
                  <div className="flex gap-2">
                    <input value={video} onChange={(e) => setVideo(e.target.value)} placeholder="Video URL" className="flex-1 bg-black border border-white/20 p-2 rounded text-sm" />
                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-2 rounded text-xs flex items-center transition-colors">
                      Upload
                      <input type="file" accept="video/mp4" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setVideo(URL.createObjectURL(file));
                      }} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1">Primary Link (Case Study)</label>
                  <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Watch More Link</label>
                  <input value={watchMoreLink} onChange={(e) => setWatchMoreLink(e.target.value)} placeholder="https://" className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Logo Link (e.g. Instagram)</label>
                  <input value={logoLink} onChange={(e) => setLogoLink(e.target.value)} placeholder="https://" className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                </div>
                <button type="submit" className={`w-full mt-4 font-bold p-3 rounded transition-colors ${editingWorkId ? "bg-brand-sky text-white hover:bg-brand-sky/80" : "bg-white text-black hover:bg-gray-200"}`}>
                  {editingWorkId ? "Update Project" : "Append Project"}
                </button>
              </form>
            </div>

            <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10">
              <h2 className="text-xl font-display mb-6">Manage Projects ({data.work.length})</h2>
              <div className="space-y-3">
                {data.work.map((item) => (
                  <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${editingWorkId === item.id ? "bg-brand-sky/20 border-brand-sky" : "bg-black/50 border-white/5"}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-cover bg-center" style={{ backgroundImage: `url(${item.thumbnail})` }} />
                      <div>
                        <p className="text-sm font-bold">{item.client}</p>
                        <p className="text-xs text-white/40">{item.platform}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditWork(item)}
                        className="text-xs text-brand-sky hover:text-white p-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => removeWork(item.id)}
                        className="text-xs text-red-500 hover:text-red-400 p-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-8">
            <div id="feedback-form" className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display">{editingFeedbackId ? "Update Feedback" : "Add Feedback"}</h2>
                {editingFeedbackId && (
                  <button 
                    onClick={() => {
                      setEditingFeedbackId(null);
                      setTitle("");
                      setQuote("");
                      setFeedbackBody("");
                      setImage("");
                      setName("");
                      setPoints("");
                      setStars("5");
                    }}
                    className="text-xs text-white/40 hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={handleAddFeedback} className="space-y-4">
                {/* ... fields ... (keep existing) */}
                <div>
                  <label className="block text-xs text-white/50 mb-1">Quote (Short Impact)*</label>
                  <textarea required value={quote} onChange={(e) => setQuote(e.target.value)} rows={2} className="w-full bg-black border border-white/20 p-2 rounded text-sm" placeholder="e.g. Poore India mein aag laga di!" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Full Feedback Body (Detailed)</label>
                  <textarea value={feedbackBody} onChange={(e) => setFeedbackBody(e.target.value)} rows={3} className="w-full bg-black border border-white/20 p-2 rounded text-sm" placeholder="Detailed testimonial text..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Client Name*</label>
                    <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Key Points*</label>
                    <input required value={points} onChange={(e) => setPoints(e.target.value)} placeholder="e.g. ROI, Viral, Scaling" className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Brand Name/Title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Card Color</label>
                    <input type="color" value={feedbackColor} onChange={(e) => setFeedbackColor(e.target.value)} className="w-full h-[38px] bg-black border border-white/20 p-1 rounded cursor-pointer" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Rating (1-5 Stars)</label>
                    <select value={stars} onChange={(e) => setStars(e.target.value)} className="w-full bg-black border border-white/20 p-2 rounded text-sm h-[38px]">
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Feedbacker Picture</label>
                    <div className="flex gap-2">
                      <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" className="flex-1 bg-black border border-white/20 p-2 rounded text-sm" />
                      <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-2 rounded text-xs flex items-center transition-colors">
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setImage(URL.createObjectURL(file));
                        }} />
                      </label>
                    </div>
                  </div>
                </div>
                <button type="submit" className={`w-full mt-4 font-bold p-3 rounded transition-colors ${editingFeedbackId ? "bg-brand-sky text-white hover:bg-brand-sky/80" : "bg-white text-black hover:bg-gray-200"}`}>
                  {editingFeedbackId ? "Update Feedback" : "Append Feedback"}
                </button>
              </form>
            </div>

            <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10">
              <h2 className="text-xl font-display mb-6">Manage Feedback ({data.feedback.length})</h2>
              <div className="space-y-3">
                {data.feedback.map((item, idx) => (
                  <div key={item.id || idx} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${editingFeedbackId === item.id ? "bg-brand-sky/20 border-brand-sky" : "bg-black/50 border-white/5"}`}>
                    <div>
                      <p className="text-sm font-bold">{item.name || item.title}</p>
                      <p className="text-xs text-white/40 truncate max-w-[200px]">&quot;{item.quote}&quot;</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditFeedback(item)}
                        className="text-xs text-brand-sky hover:text-white p-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => removeFeedback(item.id)}
                        className="text-xs text-red-500 hover:text-red-400 p-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
