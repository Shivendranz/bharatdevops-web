"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function SyllabusPage() {
  const params = useParams();
  
  // ✅ 'id' variable mein Course ka slug (e.g., 'linux-roadmap') aayega
  const id = params?.id; 
  const [course, setCourse] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      setError(false);
      // Backend slug se detail fetch karega
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}/`;
      
      axios.get(apiUrl)
        .then(res => {
          setCourse(res.data);
        })
        .catch(err => {
          console.error("❌ Syllabus Load Error:", err.response?.status, err.message);
          setError(true);
        });
    }
  }, [id]);

  // 1. Error State
  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fdfbf7] p-6 text-center">
      <div className="text-orange-600 font-black text-5xl mb-4 tracking-tighter uppercase">404_NOT_FOUND</div>
      <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-8">The requested roadmap "{id}" does not exist.</p>
      <Link href="/" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-orange-600 transition-colors">
        Return to Base
      </Link>
    </div>
  );

  // 2. Loading State
  if (!course) return (
    <div className="h-screen flex items-center justify-center bg-[#fdfbf7]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
        <div className="text-slate-400 font-mono animate-pulse tracking-widest uppercase text-[10px]">
          Decrypting_Blueprint...
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-800 pb-24 pt-16">
      
      {/* 🟢 HEADER SECTION */}
      <div className="w-full bg-slate-950 border-b border-slate-900 py-16 md:py-28 px-6 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-600/5 skew-x-[-20deg] translate-x-20 blur-3xl"></div>
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-orange-500 transition-all flex items-center gap-3 group">
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Return_to_Roadmap
          </Link>
          
          <div className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-4">
              <span className="bg-orange-600/10 text-orange-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-600/20">
                Validated_Curriculum_2026
              </span>
              <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.8]">
                {course.title}<br/>
                <span className="text-orange-600 italic">Blueprint</span>
              </h1>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] shadow-2xl min-w-[280px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status: Active</p>
              </div>
              <p className="text-2xl font-black text-white uppercase tracking-tighter">Roadmap_Live</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🟠 MODULES & LESSONS SECTION */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 space-y-32">
        {course.modules?.map((module: any, mIdx: number) => (
          <div key={module.id} className="relative bg-white border border-slate-100 rounded-[3.5rem] md:rounded-[5rem] p-10 md:p-20 transition-all hover:shadow-2xl hover:shadow-orange-100/40 group">
            
            <div className="absolute -top-10 left-8 md:left-20 flex items-center gap-4">
              <div className="bg-orange-600 text-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl group-hover:rotate-6 transition-transform">
                {String(mIdx + 1).padStart(2, '0')}
              </div>
              <div className="bg-slate-950 px-10 py-5 rounded-[1.5rem] shadow-2xl border border-slate-800">
                <h2 className="text-[12px] md:text-[16px] font-black text-white uppercase tracking-[0.25em]">
                  {module.title}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-14 md:mt-8">
              {module.lessons?.map((lesson: any, lIdx: number) => (
                <Link 
                  key={lesson.id} 
                  // ✅ FIXED: Yahan ab sirf lesson.slug use hoga, ID fallback hata diya gaya hai
                  href={`/courses/${id}/${lesson.slug}`} 
                  className="group/lesson"
                >
                  <div className="bg-slate-50 border border-slate-100 px-8 py-5 rounded-2xl flex items-center transition-all group-hover/lesson:bg-white group-hover/lesson:border-orange-500 group-hover/lesson:-translate-y-1.5 shadow-sm hover:shadow-xl whitespace-nowrap overflow-hidden relative">
                    <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-orange-600 group-hover/lesson:w-full transition-all duration-500"></div>
                    <span className="text-[10px] font-black text-slate-300 group-hover/lesson:text-orange-600 mr-5 border-r border-slate-200 pr-5">
                      L_{String(lIdx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[14px] md:text-[17px] font-black text-slate-700 group-hover/lesson:text-slate-900 tracking-tight uppercase">
                      {lesson.title}
                    </span>
                    <span className="ml-5 text-slate-200 group-hover/lesson:text-orange-500 transition-colors font-bold text-xl">⚡</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}