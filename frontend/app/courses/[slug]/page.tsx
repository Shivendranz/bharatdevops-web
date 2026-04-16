"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function SyllabusPage() {
  const params = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const slug = params?.slug;
  const backendBaseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    if (!slug) return;
    axios.get(`${backendBaseURL}/api/courses/${slug}/`)
      .then(res => { setCourse(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white font-mono text-[10px] tracking-[0.3em] text-slate-400 uppercase">
      Initialising_Roadmap...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-32 selection:bg-orange-100">
      
      {/* 🏔️ HEADER */}
      <div className="w-full bg-slate-950 pt-28 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '25px 25px' }}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-4 block">Official Blueprint</span>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                {course?.title} <span className="text-orange-600">Roadmap</span>
              </h1>
            </div>
            <div className="max-w-xs md:text-right">
               <p className="text-slate-400 text-sm font-medium leading-relaxed italic border-l-2 md:border-l-0 md:border-r-2 border-orange-600 px-4">
                 Step-by-step masterclass to build industry-ready skills in {course?.title}.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🛠️ MODULE CARDS & DYNAMIC LESSONS */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        <div className="space-y-10">
          {course?.modules?.map((module: any, mIdx: number) => (
            <div key={module.id} className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden group hover:border-orange-500/30 transition-all duration-500">
              
              {/* Section Header */}
              <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-slate-300 group-hover:text-orange-600 transition-colors">
                    {String(mIdx + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    {module.title}
                  </h2>
                </div>
                <div className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-orange-500 animate-pulse"></div>
              </div>

              {/* Lesson Boxes (Word ke hisab se size) */}
              <div className="p-8">
                <div className="flex flex-wrap gap-3">
                  {module.lessons?.map((lesson: any) => (
                    <Link 
                      key={lesson.id}
                      href={`/courses/${slug}/${lesson.slug}`}
                      className="inline-flex items-center gap-3 px-5 py-3.5 bg-white border border-slate-100 rounded-2xl hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/5 transition-all group/item"
                    >
                      {/* Left Dot */}
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/item:bg-orange-600 group-hover/item:scale-125 transition-all"></div>
                      
                      {/* Lesson Title (Auto-width) */}
                      <span className="text-[14px] font-bold text-slate-600 group-hover/item:text-slate-950 transition-colors whitespace-nowrap">
                        {lesson.title}
                      </span>

                      {/* Right Arrow */}
                      <svg className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-orange-600 group-hover/item:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 🏁 START ACTION */}
      <div className="max-w-6xl mx-auto px-6 mt-32 text-center">
         <div className="h-[1px] w-full bg-slate-100 mb-16"></div>
         <Link 
            href={`/courses/${slug}/${course?.modules?.[0]?.lessons?.[0]?.slug}`}
            className="inline-block px-12 py-5 bg-slate-950 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-orange-600 hover:-translate-y-1 transition-all shadow-2xl"
          >
            Launch_Roadmap_Now →
          </Link>
          <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version 2.0 // Powered by BharatDevops</p>
      </div>

    </div>
  );
}