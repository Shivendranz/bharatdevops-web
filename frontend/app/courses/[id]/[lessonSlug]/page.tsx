"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function LessonDetail() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const backendBaseURL = "${process.env.NEXT_PUBLIC_API_URL}";

  // URL se slug nikalne ka logic (Direct from params)
  const currentSlug = params?.lessonSlug as string;

  useEffect(() => {
    setMounted(true);
  }, []);

  // API se Data Fetch karna
  useEffect(() => {
    if (!mounted || !currentSlug) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendBaseURL}/api/lessons/${currentSlug}/`);
        setLesson(res.data);
      } catch (err) {
        console.error("❌ API Error:", err);
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [mounted, currentSlug]);

  // Lesson change hote hi scroll top par le jana
  useEffect(() => {
    if (currentSlug) {
      window.scrollTo(0, 0);
    }
  }, [currentSlug]);

  if (!mounted) return null;

  // Loading State
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-600/20 border-t-orange-600 rounded-full animate-spin"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Loading_Session</span>
        </div>
      </div>
    );
  }

  // Error State
  if (!lesson) return <div className="p-20 text-center text-red-500 uppercase font-mono">404: Knowledge_Base_Offline</div>;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white font-sans selection:bg-orange-100">
      
      {/* 🟢 MAIN CONTENT (Left Aligned) */}
      <div className="flex-1 px-6 py-12 md:py-20 lg:px-16 border-r border-slate-50">
        
        {/* Header Section */}
        <header className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-[1px] w-8 bg-orange-500"></span>
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest">
              Course / {lesson.slug}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {lesson.title}
          </h1>
        </header>

        {/* Content Section (No max-width limit) */}
        <article className="min-h-[50vh] max-w-none">
          <div 
            className="ck-content text-[18px] text-slate-700 leading-relaxed font-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
            dangerouslySetInnerHTML={{ 
              __html: lesson.content?.replace(/src="\/media\//g, `src="${backendBaseURL}/media/`) || "" 
            }} 
          />
        </article>

        {/* ⏭️ NAVIGATION (ID Based) */}
        <div className="mt-24 pt-8 border-t border-slate-100 flex items-center justify-between">
          
          {/* Previous Button */}
          {lesson?.prev_lesson?.slug ? (
            <button 
              onClick={() => router.push(`/courses/${params.id}/${lesson.prev_lesson.slug}`)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-500 transition-all text-xs font-bold group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> 
              {lesson.prev_lesson.title}
            </button>
          ) : <div />}

          {/* Next Button */}
          {lesson?.next_lesson?.slug ? (
            <button 
              onClick={() => router.push(`/courses/${params.id}/${lesson.next_lesson.slug}`)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-orange-600 transition-all text-xs font-bold group"
            >
              {lesson.next_lesson.title} 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
              🎉 End of Course
            </span>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 flex items-center justify-between opacity-30 grayscale border-t border-slate-50 pt-8">
          <span className="text-[10px] font-mono uppercase tracking-widest">Hash: {lesson.slug}</span>
          <span className="text-[10px] font-mono uppercase">BharatDevops v2.0</span>
        </footer>
      </div>

      {/* 🟠 SIDEBAR */}
      <aside className="hidden xl:flex flex-col w-[320px] p-8 gap-6 bg-slate-50/50 sticky top-0 h-screen overflow-y-auto">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Featured_Content</div>
        
        <div className="w-full bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 bg-orange-100 rounded-lg mb-4 flex items-center justify-center text-orange-600 font-bold text-xs">01</div>
          <h4 className="text-sm font-black text-slate-800 uppercase leading-tight mb-2">Pro Mentorship</h4>
          <p className="text-[11px] text-slate-500 leading-normal font-medium">Join 500+ developers in our private Discord community.</p>
        </div>

        <div className="w-full bg-slate-950 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-600/30 blur-2xl"></div>
          <h4 className="text-sm font-black text-white uppercase mb-1 relative z-10 italic">Cloud Masterclass</h4>
          <p className="text-[10px] text-slate-400 relative z-10 mb-4 font-mono">AWS_ARCHITECT_TRAINER</p>
          <div className="text-[10px] font-bold text-orange-500">Learn More →</div>
        </div>
      </aside>

    </div>
  );
}