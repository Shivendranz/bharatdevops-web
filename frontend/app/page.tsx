"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function HomePage() {
  const [sections, setSections] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState("");

  const backendBaseURL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backendBaseURL}/api/home-sections/`);
        setSections(res.data.sort((a: any, b: any) => a.order - b.order));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [backendBaseURL]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#fcfcfd] selection:bg-indigo-100 overflow-x-hidden">
      
      {/* 🌈 1. VIBRANT GRADIENT HERO */}
      <section className="relative w-full pt-44 pb-48 flex flex-col items-center px-6 text-center">
        {/* Animated Aurora Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-200/40 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-orange-100/50 blur-[100px] rounded-full animate-bounce"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-indigo-100/40 blur-[120px] rounded-full"></div>

        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">The Future of DevOps</span>
          </div>
          <h1 className="text-6xl md:text-[110px] font-black tracking-[-0.05em] text-slate-900 leading-[0.85] mb-10">
            Learn with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-500">Pure Precision.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-2xl font-semibold max-w-2xl mx-auto leading-snug tracking-tight">
            BharatDevOps brings you production-grade roadmaps with a splash of modern engineering aesthetics.
          </p>
        </div>
      </section>

      {/* 🔍 2. SEARCH (Glassmorphism with Tint) */}
      <div className="sticky top-10 z-50 px-6 -mt-16">
        <div className="max-w-3xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-white/70 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-indigo-100/50 rounded-3xl flex items-center p-2">
             <div className="flex-1 flex items-center px-6 gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input 
                  type="text"
                  placeholder="Find your next milestone..."
                  className="w-full py-5 bg-transparent outline-none font-bold text-slate-800 placeholder:text-slate-400 text-sm md:text-base"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
             </div>
          </div>
        </div>
      </div>

      {/* 📦 3. COLOR-CODED BENTO SECTIONS */}
      <div className="flex-grow py-32 px-6 max-w-7xl mx-auto w-full">
        {sections.map((section: any) => {
          if (section.section_type === 'hero') return null;
          const visibleItems = (section.items || []).filter((item: any) => 
            item.title?.toLowerCase().includes(localSearch.toLowerCase())
          );
          if (visibleItems.length === 0) return null;

          return (
            <section key={section.id} className="mb-48">
              <div className="flex items-center gap-4 mb-16">
                <span className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black italic text-xl shadow-lg shadow-indigo-200">
                  {section.order}
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">{section.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {visibleItems.map((item: any, i: number) => (
                  <Link 
                    href={`/courses/${item.course_slug}`} 
                    key={i} 
                    className="group relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] transition-all duration-700 overflow-hidden"
                  >
                    {/* Background Glow on Hover */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/0 group-hover:bg-indigo-50/100 rounded-full blur-3xl transition-all duration-700"></div>

                    <div className="relative z-10">
                      <div className="text-6xl mb-8 group-hover:scale-125 transition-transform duration-700 drop-shadow-sm">
                        {item.icon || '🛠️'}
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="mt-6 flex items-center gap-3">
                         <div className="h-[2px] w-8 bg-indigo-100 group-hover:w-16 group-hover:bg-indigo-600 transition-all duration-500"></div>
                         <span className="text-[10px] font-black uppercase text-slate-300 group-hover:text-indigo-600 tracking-widest">Blueprint</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="py-32 bg-slate-950 text-center rounded-t-[4rem]">
         <h2 className="text-3xl font-black text-white mb-4 italic">Ready to scale?</h2>
         <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[10px]">BharatDevops Engineering // 2026</p>
      </footer>
    </div>
  );
}