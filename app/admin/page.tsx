"use client";

import React, { useState } from "react";
import { useDynamicData } from "@/lib/DynamicDataContext";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { addWork, updateWork, removeWork, addFeedback, updateFeedback, removeFeedback, addBrand, updateBrand, removeBrand, addResult, updateResult, removeResult, moveWork, moveFeedback, moveBrand, moveResult, restoreItem, permanentlyDeleteItem, resetData, resetToDefaults, data } = useDynamicData();
  
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
  const [headline, setHeadline] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [image, setImage] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("#F5F0E8");
  const [clientName, setClientName] = useState("");
  const [points, setPoints] = useState("");
  const [stars, setStars] = useState("5");

  // Editing state
  const [editingWorkId, setEditingWorkId] = useState<number | null>(null);
  const [editingFeedbackId, setEditingFeedbackId] = useState<number | null>(null);
  const [editingBrandId, setEditingBrandId] = useState<number | null>(null);
  const [editingStatId, setEditingStatId] = useState<number | null>(null);

  // Brands form state
  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState("");

  // Results form state
  const [statValue, setStatValue] = useState("");
  const [statSuffix, setStatSuffix] = useState("");
  const [statLabel, setStatLabel] = useState("");

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

    if (editingWorkId) {
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
    alert(editingWorkId ? "Project updated!" : "Project added successfully!");
  };

  const startEditProject = (project: any) => {
    setEditingWorkId(project.id);
    setClient(project.client || "");
    setPlatform(project.platform || "");
    setViews(project.views || "");
    setColor(project.color || "#E63946");
    setThumbnail(project.thumbnail || "");
    setLogo(project.logo || "");
    setVideo(project.video || "");
    setLink(project.link || "");
    setWatchMoreLink(project.watchMoreLink || "");
    setLogoLink(project.logoLink || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline || !clientName || !testimonial) return alert("Headline, Client Name, and Testimonial are required");

    const feedbackData = {
      id: editingFeedbackId || Date.now(),
      title: clientName,
      quote: headline,
      feedback: testimonial,
      image: image || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
      color: feedbackColor,
      points,
      stars,
    };

    if (editingFeedbackId) {
      updateFeedback(feedbackData);
      setEditingFeedbackId(null);
    } else {
      addFeedback(feedbackData);
    }

    setHeadline("");
    setTestimonial("");
    setImage("");
    setClientName("");
    setPoints("");
    setStars("5");
    alert(editingFeedbackId ? "Feedback updated!" : "Feedback added successfully!");
  };

  const startEditFeedback = (item: any) => {
    setEditingFeedbackId(item.id);
    setHeadline(item.quote || "");
    setTestimonial(item.feedback || "");
    setClientName(item.title || "");
    setPoints(item.points || "");
    setStars(item.stars || "5");
    setImage(item.image || "");
    setFeedbackColor(item.color || "#F5F0E8");
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !brandLogo) return alert("Name and Logo are required");

    const brandData = {
      id: editingBrandId || Date.now(),
      name: brandName,
      logo: brandLogo,
    };

    if (editingBrandId) {
      updateBrand(brandData);
      setEditingBrandId(null);
    } else {
      addBrand(brandData);
    }

    setBrandName("");
    setBrandLogo("");
    alert(editingBrandId ? "Brand updated!" : "Brand added!");
  };

  const startEditBrand = (brand: any) => {
    setEditingBrandId(brand.id);
    setBrandName(brand.name);
    setBrandLogo(brand.logo);
  };

  const handleAddResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statValue || !statLabel) return alert("Value and Label are required");

    const statData = {
      id: editingStatId || Date.now(),
      value: Number(statValue),
      suffix: statSuffix,
      label: statLabel,
    };

    if (editingStatId) {
      updateResult(statData);
      setEditingStatId(null);
    } else {
      addResult(statData);
    }

    setStatValue("");
    setStatSuffix("");
    setStatLabel("");
    alert(editingStatId ? "Stat updated!" : "Stat added!");
  };

  const startEditResult = (stat: any) => {
    setEditingStatId(stat.id);
    setStatValue(stat.value.toString());
    setStatSuffix(stat.suffix);
    setStatLabel(stat.label);
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
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans selection:bg-white/20" style={{ cursor: 'default' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tighter">Admin Panel</h1>
            <p className="text-white/50 font-mono text-sm mt-2 uppercase tracking-widest">Control the viral experience</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                if (confirm("This will restore all original data and projects. Your custom changes might be overwritten. Proceed?")) {
                  resetToDefaults();
                }
              }}
              className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold hover:bg-blue-600/30 transition-all uppercase tracking-widest"
            >
              Reset to Original
            </button>
            <button 
              onClick={() => {
                sessionStorage.removeItem("viralDuoAdminSession");
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-600/30 transition-all uppercase tracking-widest"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Projects Section */}
          <div className="space-y-8">
            <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display">{editingWorkId ? "Edit Project" : "Add New Project"}</h2>
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
                    }}
                    className="text-xs text-white/50 hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={handleAddProject} className="space-y-4">
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
                <button type="submit" className="w-full mt-4 bg-white text-black font-bold p-3 rounded hover:bg-gray-200 transition-colors">
                  {editingWorkId ? "Save Changes" : "Append Project"}
                </button>
              </form>
            </div>

            {data.work.length > 0 && (
              <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10">
                <h2 className="text-xl font-display mb-6">Added Projects ({data.work.length})</h2>
                <div className="space-y-3">
                  {data.work.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-cover bg-center" style={{ backgroundImage: `url(${item.thumbnail})` }} />
                        <div>
                          <p className="text-sm font-bold">{item.client}</p>
                          <p className="text-xs text-white/40">{item.platform}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div className="flex flex-col gap-1 mr-2">
                          <button onClick={() => moveWork(item.id, 'up')} className="text-[10px] bg-white/5 hover:bg-white/10 px-1 rounded">▲</button>
                          <button onClick={() => moveWork(item.id, 'down')} className="text-[10px] bg-white/5 hover:bg-white/10 px-1 rounded">▼</button>
                        </div>
                        <button 
                          onClick={() => startEditProject(item)}
                          className="text-xs text-blue-400 hover:text-blue-300 p-2"
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
            )}
          </div>

          {/* Feedback Section */}
          <div className="space-y-8">
            <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display">{editingFeedbackId ? "Edit Feedback" : "Add Feedback"}</h2>
                {editingFeedbackId && (
                  <button 
                    onClick={() => {
                      setEditingFeedbackId(null);
                      setHeadline("");
                      setTestimonial("");
                      setClientName("");
                      setPoints("");
                      setImage("");
                    }}
                    className="text-xs text-white/50 hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={handleAddFeedback} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1">Italic Headline*</label>
                  <input required value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Desi travelers ke liye best content creator." className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Main Testimonial*</label>
                  <textarea required value={testimonial} onChange={(e) => setTestimonial(e.target.value)} rows={3} placeholder="The long paragraph content..." className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Client Name*</label>
                    <input required value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. SHARMA JI KE BHATURE" className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Key Points* (comma separated)</label>
                    <input required value={points} onChange={(e) => setPoints(e.target.value)} placeholder="e.g. ROI, Viral, Scaling" className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
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
                    <label className="block text-xs text-white/50 mb-1">Feedbacker Picture (Logo)</label>
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
                <button type="submit" className="w-full mt-4 bg-white text-black font-bold p-3 rounded hover:bg-gray-200 transition-colors">
                  {editingFeedbackId ? "Save Changes" : "Append Feedback"}
                </button>
              </form>
            </div>

            {data.feedback.length > 0 && (
              <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10">
                <h2 className="text-xl font-display mb-6">Added Feedback ({data.feedback.length})</h2>
                <div className="space-y-3">
                  {data.feedback.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-white/5">
                      <div>
                        <p className="text-sm font-bold">{item.title}</p>
                        <p className="text-xs text-white/40 truncate max-w-[200px]">&quot;{item.quote}&quot;</p>
                      </div>
                      <div className="flex gap-1">
                        <div className="flex flex-col gap-1 mr-2">
                          <button onClick={() => moveFeedback(item.id, 'up')} className="text-[10px] bg-white/5 hover:bg-white/10 px-1 rounded">▲</button>
                          <button onClick={() => moveFeedback(item.id, 'down')} className="text-[10px] bg-white/5 hover:bg-white/10 px-1 rounded">▼</button>
                        </div>
                        <button 
                          onClick={() => startEditFeedback(item)}
                          className="text-xs text-blue-400 hover:text-blue-300 p-2"
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
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Brands Section */}
          <div className="space-y-8">
            <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display">{editingBrandId ? "Edit Brand" : "Add Brand"}</h2>
                {editingBrandId && (
                  <button onClick={() => { setEditingBrandId(null); setBrandName(""); setBrandLogo(""); }} className="text-xs text-white/50 hover:text-white">Cancel</button>
                )}
              </div>
              <form onSubmit={handleAddBrand} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1">Brand Name*</label>
                  <input required value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Logo URL*</label>
                  <input required value={brandLogo} onChange={(e) => setBrandLogo(e.target.value)} className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                </div>
                <button type="submit" className="w-full mt-4 bg-white text-black font-bold p-3 rounded hover:bg-gray-200 transition-colors">
                  {editingBrandId ? "Save Changes" : "Append Brand"}
                </button>
              </form>
            </div>

            {data.brands.length > 0 && (
              <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10">
                <h2 className="text-xl font-display mb-6">Current Brands ({data.brands.length})</h2>
                <div className="grid grid-cols-2 gap-3">
                  {data.brands.map((brand) => (
                    <div key={brand.id} className="p-3 bg-black/50 rounded-lg border border-white/5 flex flex-col items-center gap-2">
                      <div className="w-12 h-12 relative grayscale group-hover:grayscale-0 transition-all">
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                      </div>
                      <p className="text-[10px] font-bold uppercase truncate w-full text-center">{brand.name}</p>
                      <div className="flex gap-2 w-full">
                        <div className="flex flex-1 gap-1">
                          <button onClick={() => moveBrand(brand.id, 'up')} className="flex-1 text-[10px] bg-white/5 rounded">▲</button>
                          <button onClick={() => moveBrand(brand.id, 'down')} className="flex-1 text-[10px] bg-white/5 rounded">▼</button>
                        </div>
                        <button onClick={() => startEditBrand(brand)} className="flex-1 text-[10px] text-blue-400 bg-white/5 p-1 rounded">Edit</button>
                        <button onClick={() => removeBrand(brand.id)} className="flex-1 text-[10px] text-red-500 bg-white/5 p-1 rounded">Del</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display">{editingStatId ? "Edit Stat" : "Add Stat"}</h2>
                {editingStatId && (
                  <button onClick={() => { setEditingStatId(null); setStatValue(""); setStatSuffix(""); setStatLabel(""); }} className="text-xs text-white/50 hover:text-white">Cancel</button>
                )}
              </div>
              <form onSubmit={handleAddResult} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Value* (Number)</label>
                    <input required type="number" value={statValue} onChange={(e) => setStatValue(e.target.value)} className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Suffix (e.g. M+, X, %)</label>
                    <input value={statSuffix} onChange={(e) => setStatSuffix(e.target.value)} className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Label*</label>
                  <input required value={statLabel} onChange={(e) => setStatLabel(e.target.value)} placeholder="e.g. Views Generated" className="w-full bg-black border border-white/20 p-2 rounded text-sm" />
                </div>
                <button type="submit" className="w-full mt-4 bg-white text-black font-bold p-3 rounded hover:bg-gray-200 transition-colors">
                  {editingStatId ? "Save Changes" : "Append Stat"}
                </button>
              </form>
            </div>

            {data.results.length > 0 && (
              <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10">
                <h2 className="text-xl font-display mb-6">Current Stats ({data.results.length})</h2>
                <div className="space-y-3">
                  {data.results.map((stat) => (
                    <div key={stat.id} className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-white/5">
                      <div>
                        <p className="text-sm font-bold">{stat.value}{stat.suffix}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-tighter">{stat.label}</p>
                      </div>
                      <div className="flex gap-1">
                        <div className="flex flex-col gap-1 mr-2">
                          <button onClick={() => moveResult(stat.id, 'up')} className="text-[10px] bg-white/5 hover:bg-white/10 px-1 rounded">▲</button>
                          <button onClick={() => moveResult(stat.id, 'down')} className="text-[10px] bg-white/5 hover:bg-white/10 px-1 rounded">▼</button>
                        </div>
                        <button onClick={() => startEditResult(stat)} className="text-xs text-blue-400 p-2">Edit</button>
                        <button onClick={() => removeResult(stat.id)} className="text-xs text-red-500 p-2">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Trash Bin Section */}
        {data.trash.length > 0 && (
          <div className="mt-12 pt-12 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display flex items-center gap-3">
                <span className="p-2 bg-red-500/10 rounded-lg">🗑️</span>
                Trash Bin ({data.trash.length})
              </h2>
              <p className="text-white/30 text-xs italic">Items here can be restored or deleted forever</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.trash.map((item) => (
                <div key={item.id} className="bg-[#111] p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        item.__type === 'work' ? 'bg-blue-500/20 text-blue-400' : 
                        item.__type === 'feedback' ? 'bg-purple-500/20 text-purple-400' :
                        item.__type === 'brand' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {item.__type}
                      </span>
                      <span className="text-[10px] text-white/20 font-mono">ID: {item.id}</span>
                    </div>
                    <p className="text-sm font-bold truncate">{item.client || item.title || item.name || item.label}</p>
                    <p className="text-xs text-white/40 line-clamp-2 mt-1 italic">&quot;{item.platform || item.quote || item.feedback || item.logo || `${item.value}${item.suffix}`}&quot;</p>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => restoreItem(item.id)}
                      className="flex-1 text-xs bg-white/5 hover:bg-white/10 text-white p-2 rounded transition-colors"
                    >
                      Restore
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm("Delete this item permanently?")) {
                          permanentlyDeleteItem(item.id);
                        }
                      }}
                      className="flex-1 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded transition-colors"
                    >
                      Delete Forever
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
