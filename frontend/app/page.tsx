"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function HomePage() {
  const [sections, setSections] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/home-sections/`);
        const sortedData = res.data.sort((a: any, b: any) => a.order - b.order);
        setSections(sortedData);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#fdfbf7]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-600/10 border-t-orange-600 rounded-full animate-spin"></div>
        <div className="text-slate-400 font-mono animate-pulse tracking-[0.3em] text-[10px] uppercase">Initializing_System...</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#fafafa] selection:bg-orange-100">
      
      {/* 🚀 1. MODERN HERO SECTION */}
      {sections.find(s => s.section_type === 'hero') && (
        <section className="relative w-full py-24 md:py-32 flex items-center justify-center bg-slate-950 overflow-hidden">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
          </div>

          <div className="relative z-10 text-center px-6 max-w-4xl">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-orange-500/10 border border-orange-500/20">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
                🚀 Industry Standard Roadmap
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[0.9]">
              {sections.find(s => s.section_type === 'hero')?.title}
            </h1>
            <p className="mt-8 text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Master DevOps & Cloud with our structured, step-by-step learning paths. No more confusion, only execution.
            </p>
          </div>
        </section>
      )}

      {/* 🔍 2. SEARCH BAR (Glassmorphism) */}
      <div className="sticky top-16 z-40 px-6 -mt-8">
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl p-2 flex flex-col md:flex-row items-center gap-2">
          <input 
            type="text"
            placeholder="Search your roadmap (e.g. Linux, AWS, Docker)..."
            className="w-full px-6 py-4 bg-transparent outline-none font-bold text-slate-700 placeholder:text-slate-400"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <button className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all">
            Filter
          </button>
        </div>
      </div>

      {/* 📦 3. CONTENT SECTIONS */}
      <div className="flex-grow py-20 space-y-32">
        {sections.map((section: any) => {
          if (section.section_type === 'hero') return null;

          const visibleItems = (section.items || []).filter((item: any) => 
            item.title?.toLowerCase().includes(localSearch.toLowerCase())
          );

          if (visibleItems.length === 0) return null;

          return (
            <section key={section.id} className="max-w-[1450px] mx-auto px-6">
              <div className="flex items-end justify-between mb-12 border-b border-slate-100 pb-6">
                <div>
                  <span className="text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Level_{section.order}</span>
                  <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900">{section.title}</h2>
                </div>
                <div className="hidden md:block text-slate-300 font-mono text-xs uppercase">
                  Count: {visibleItems.length}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {visibleItems.map((item: any, i: number) => {
                  const identifier = item.course_slug?.toString();
                  const roadmapLink = identifier ? `/courses/${identifier}` : (item.link || "#");

                  return (
                    <Link 
                      href={roadmapLink} 
                      key={`item-${i}`} 
                      className="group relative bg-white border border-slate-100 p-10 rounded-[2.5rem] flex flex-col items-center text-center hover:border-orange-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500"
                    >
                      {/* Floating Icon Animation */}
                      <div className="text-6xl mb-6 transform group-hover:-translate-y-3 group-hover:scale-110 transition-all duration-500 ease-out drop-shadow-sm">
                        {item.icon || '⚙️'}
                      </div>
                      
                      <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 group-hover:text-orange-600 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="mt-3 text-[11px] text-slate-400 font-bold leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View Detailed Roadmap
                      </p>

                      {/* Bottom Status Bar */}
                      <div className="absolute bottom-0 left-10 right-10 h-1 bg-slate-50 group-hover:bg-orange-500 transition-all duration-500 rounded-t-full"></div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}