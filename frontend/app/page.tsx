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
        // Order ke hisaab se sort kar rahe hain
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
      <div className="text-slate-400 font-mono animate-pulse tracking-widest uppercase text-[12px]">Initializing_Core...</div>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#fdfbf7] pt-16 selection:bg-orange-100 overflow-x-hidden">
      
      {/* 🔹 Background Animation CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flowBackground { 0% { background-position: 0px 0px; } 100% { background-position: 100px 100px; } }
        .animated-flow-bg {
          background-image: radial-gradient(#ffffff 1px, transparent 1px), linear-gradient(#ffffff 0.5px, transparent 0.5px), linear-gradient(90deg, #ffffff 0.5px, transparent 0.5px);
          background-size: 20px 20px, 40px 40px, 40px 40px; animation: flowBackground 15s linear infinite; opacity: 0.06; position: absolute; inset: 0; z-index: 1;
        }
      `}} />

      {/* 🚀 1. HERO BANNER */}
      {sections.find(s => s.section_type === 'hero') && (
        <section className="w-full h-[300px] md:h-[350px] flex items-center justify-center bg-slate-950 border-b border-slate-900 relative overflow-hidden group">
          <div className="animated-flow-bg transition-opacity group-hover:opacity-[0.1]"></div>
          <div className="z-10 text-center px-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-400 opacity-60">BharatDevops_Initiative</span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mt-3">
              {sections.find(s => s.section_type === 'hero')?.title}
            </h1>
            <p className="max-w-xl mx-auto mt-4 text-slate-500 font-bold text-xs uppercase tracking-[0.15em]">
              Master the cloud ecosystem. Direct access to roadmap.
            </p>
          </div>
        </section>
      )}

      {/* 🔍 2. FILTER SECTION */}
      <div className="w-full py-8 px-6 md:px-20 bg-white border-b border-slate-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-[1450px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
             <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-orange-600 mb-1">Subject Roadmap</h3>
             <p className="text-sm font-bold text-slate-400">Jump directly into the tech stack</p>
          </div>
          <input 
            type="text"
            placeholder="Filter subjects (e.g. AWS, CI/CD)..."
            className="w-full md:w-[450px] px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none font-bold text-slate-700 transition-all shadow-inner"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 📦 3. MAIN CONTENT GRID */}
      <div className="flex-grow pb-20">
        {sections.map((section: any) => {
          if (section.section_type === 'hero') return null;

          // Search filtering logic
          const visibleItems = (section.items || []).filter((item: any) => 
            item.title?.toLowerCase().includes(localSearch.toLowerCase())
          );

          if (visibleItems.length === 0) return null;

          return (
            <section key={section.id} className="w-full py-16 px-6 md:px-20 border-b border-slate-100/60">
              <div className="max-w-[1450px] mx-auto">
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900">{section.title}</h2>
                  <div className="h-[2px] flex-grow bg-slate-100"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {visibleItems.map((item: any, i: number) => {
                    
                    // ✅ identifier ko string bana kar lowercase kar do taaki routing fail na ho
                    const identifier = (item.course_slug || item.course_id)?.toString();
                    const roadmapLink = identifier 
                      ? `/courses/${identifier}/` 
                      : (item.link || "#");

                    return (
                      <Link 
                        href={roadmapLink} 
                        key={`item-${i}`} 
                        className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col items-center justify-center hover:shadow-2xl hover:border-orange-500 hover:-translate-y-1.5 transition-all duration-300 group"
                      >
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {item.icon || '⚙️'}
                        </div>
                        <span className="text-[13px] font-black text-center uppercase tracking-tight text-slate-600 group-hover:text-orange-600 transition-colors">
                          {item.title}
                        </span>
                        
                        {identifier && (
                          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100">
                             <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Open_Blueprint</span>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}